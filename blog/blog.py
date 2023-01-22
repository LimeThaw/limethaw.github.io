from argparse import ArgumentParser
import datetime
import json
import shutil
from string import Template
import time
import uuid

JSON_FILE = "index.json"

def generate_article(title):
    print("generating article '"+title+"'...")

    filename = Template("$time-$title.md").substitute({
        "time": datetime.datetime.now().strftime("%y-%m-%d_%H-%M"),
        "title": title,
    })
    shutil.copyfile("templates/article_markdown.md", "posts/"+filename)

    my_uuid = uuid.uuid4().hex
    timestamp = time.time()
    with open(JSON_FILE, "r") as jsonFile:
        data = json.load(jsonFile)

    data[my_uuid] = {
        "timestamp": timestamp,
        "filename": filename,
    }

    with open(JSON_FILE, "w") as jsonFile:
        json.dump(data, jsonFile, indent=4)



def main():
    parser = ArgumentParser()
    parser.add_argument(
        'action',
        help="What would you like to do?",
        choices=["new", "generate"],
    )
    parser.add_argument(
        "--title",
        required=False,
        default="Title",
    )
    args = parser.parse_args()

    if args.action == "new":
        generate_article(args.title)
    elif args.action == "generate":
        regenerate_blog()
    else:
        print("Error: "+args)

if __name__ == '__main__':
    main()