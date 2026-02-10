import argparse
import sys
import routeros_api
import time

def connect(ip, user, password):
    try:
        connection = routeros_api.RouterOsApiPool(
            ip, 
            username=user, 
            password=password, 
            plaintext_login=True
        )
        api = connection.get_api()
        return connection, api
    except Exception as e:
        print(f"Error connecting to {ip}: {e}")
        return None, None

def enable_snmp(api):
    try:
        print("Configuring SNMP...")
        # 1. Enable SNMP Service
        snmp = api.get_resource('/snmp')
        snmp.set(enabled='yes', trap_community='public', trap_version='2')
        
        # 2. Add/Update Community 'public'
        community_resource = api.get_resource('/snmp/community')
        communities = community_resource.get(name='public')
        if not communities:
            community_resource.add(name='public', addresses='0.0.0.0/0', security='none', read_access='yes')
            print("  Created 'public' community.")
        else:
            # Update existing if needed, or just ensure it's correct
            community_id = communities[0]['id']
            community_resource.set(id=community_id, addresses='0.0.0.0/0') # Ensure open access for monitoring
            print("  Updated 'public' community.")
            
        print("SNMP configured successfully.")
        return True
    except Exception as e:
        print(f"Error configuring SNMP: {e}")
        return False

def set_identity(api, name):
    try:
        print(f"Setting Identity to '{name}'...")
        identity_resource = api.get_resource('/system/identity')
        # /system/identity is a singleton, try setting without ID
        identity_resource.set(name=name)
        print("Identity set successfully.")
        return True
    except Exception as e:
        print(f"Error setting identity: {e}")
        return False

def main():
    parser = argparse.ArgumentParser(description='Onboard a MikroTik device.')
    parser.add_argument('ip', help='Device IP Address')
    parser.add_argument('--user', default='admin', help='Username')
    parser.add_argument('--password', default='', help='Password')
    parser.add_argument('--identity', help='New System Identity')
    parser.add_argument('--snmp', action='store_true', default=True, help='Enable SNMP (default: True)')

    args = parser.parse_args()

    print(f"Connecting to {args.ip} as {args.user}...")
    connection, api = connect(args.ip, args.user, args.password)
    
    if not connection:
        sys.exit(1)

    success = True
    
    if args.snmp:
        if not enable_snmp(api):
            success = False
            
    if args.identity:
        if not set_identity(api, args.identity):
            success = False

    connection.disconnect()
    
    if success:
        print("\nOnboarding completed successfully!")
    else:
        print("\nOnboarding completed with errors.")
        sys.exit(1)

if __name__ == "__main__":
    main()
