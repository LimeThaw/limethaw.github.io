from argparse import ArgumentParser
import datetime
import json
import shutil
from string import Template
import time
import uuid
import markdown

JSON_FILE = "index.json"
PAGE_TEMPLATE = "templates/page.html"
ARTICLE_TEMPLATE = "templates/article.html"
ARTICLE_MARKDOWN = "templates/article_markdown.md"
ARTICLES_PATH = "posts/"
OUTPUT_FILE = "../index.html"

def generate_article(title):
    filename = Template("$time-$title.md").substitute({
        "time": datetime.datetime.now().strftime("%y-%m-%d_%H-%M"),
        "title": title,
    })
    shutil.copyfile(ARTICLE_MARKDOWN, ARTICLES_PATH+filename)

    my_uuid = uuid.uuid4().hex
    timestamp = time.time()
    with open(JSON_FILE, "r") as jsonFile:
        data = json.load(jsonFile)

    data[my_uuid] = {
        "title": title,
        "timestamp": timestamp,
        "filename": filename,
    }

    with open(JSON_FILE, "w") as jsonFile:
        json.dump(data, jsonFile, indent=4)

    print("\u2713 Generated article " + title + "; You can add your content in " + ARTICLES_PATH+filename)



def regenerate_blog():
    with open(PAGE_TEMPLATE, "r") as file:
        page_template = Template(file.read())

    with open(ARTICLE_TEMPLATE, "r") as file:
        article_template = Template(file.read())
        
    with open(JSON_FILE, "r") as jsonFile:
        data = json.load(jsonFile)

    articles = ""
    for key in data:
        this_data = data[key]
        this_date = datetime.datetime.utcfromtimestamp(this_data["timestamp"]).strftime('%d.%m.%Y')

        with open(ARTICLES_PATH+this_data["filename"], "r") as file:
            this_content = markdown.markdown(file.read()) # TODO: Parse Markdown

        articles = article_template.substitute({
            "title": this_data["title"],
            "date": this_date,
            "content": this_content,
        }) + articles

    page = page_template.substitute({
        "articles": articles
    })
    with open(OUTPUT_FILE, "w") as file:
        file.write(page)

    print("\u2713 Generated " + OUTPUT_FILE)



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