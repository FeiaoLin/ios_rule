import os
import subprocess
import sys

def run_command(command):
    """Executes a command and checks for errors."""
    try:
        # Using capture_output=True to get stdout/stderr
        # Using text=True to decode them as text
        # Using check=True to automatically raise an exception on non-zero exit codes
        print(f"Executing: {' '.join(command)}")
        result = subprocess.run(
            command, 
            check=True, 
            capture_output=True, 
            text=True, 
            encoding='utf-8'
        )
        if result.stdout:
            print(result.stdout)
        if result.stderr:
            print(f"Warning/Info: {result.stderr}")
        return True
    except FileNotFoundError:
        print(f"Error: Command not found - '{command[0]}'. Make sure it's in the same directory or in your system's PATH.")
        return False
    except subprocess.CalledProcessError as e:
        print(f"Error executing command: {' '.join(command)}")
        print(f"Return code: {e.returncode}")
        print(f"Output:\n{e.stdout}")
        print(f"Error Output:\n{e.stderr}")
        return False

def main():
    # Get the directory where the script is located
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir) # Change current directory to the script's directory

    # Define commands to be executed
    commands = [
        [".\\sing-box.exe", "rule-set", "compile", "--output", "lfa-proxy.srs", "lfa-proxy.json"],
        [".\\sing-box.exe", "rule-set", "compile", "--output", "lfa-direct.srs", "lfa-direct.json"]
    ]

    for cmd in commands:
        if not run_command(cmd):
            break # Stop if a command fails
    else: # This 'else' belongs to the 'for' loop, it runs if the loop completes without 'break'
        print("\nScript executed successfully.")

if __name__ == "__main__":
    main()