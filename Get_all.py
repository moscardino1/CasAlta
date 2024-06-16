import os

def write_file_contents(directory, output_file):
    """
    Recursively writes the contents of all .css, .html, and .py files in a directory and its subdirectories, excluding the 'venv' folder, to the specified output file.
    """
    for filename in os.listdir(directory):
        filepath = os.path.join(directory, filename)
        if os.path.isfile(filepath):
            # if filepath.endswith(".css") or filepath.endswith(".html") or filepath.endswith(".py") and filename !='Get_all.py':
            if filepath.endswith(".py") or filepath.endswith(".html") or filepath.endswith(".js") and filename !='Get_all.py':
                with open(output_file, "a") as f:
                    f.write(f"===== {filepath}  =====\n")
                    with open(filepath, "r") as file:
                        f.write(file.read())
                    f.write("\n")
        elif os.path.isdir(filepath) and filename != "venv" :
            write_file_contents(filepath, output_file)

# Example usage
output_filepath = "output.txt"
write_file_contents("/Users/alessandrocarli/CasAlta/", output_filepath)
print(f"Output written to {output_filepath}")