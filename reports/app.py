import pickle
import sqlite3
import subprocess

from flask import Flask, jsonify, request

app = Flask(__name__)


def connect():
    db = sqlite3.connect(":memory:")
    db.execute("create table orders (id integer primary key, customer text, total real)")
    db.executemany(
        "insert into orders (customer, total) values (?, ?)",
        [("alice", 120.5), ("bob", 33.0)],
    )
    return db


@app.get("/report")
def report():
    customer = request.args.get("customer", "")
    rows = connect().execute(f"select id, total from orders where customer = '{customer}'").fetchall()
    return jsonify(rows)


@app.get("/report/safe")
def report_safe():
    customer = request.args.get("customer", "")
    rows = connect().execute("select id, total from orders where customer = ?", (customer,)).fetchall()
    return jsonify(rows)


@app.post("/import")
def import_report():
    data = pickle.loads(request.get_data())
    return jsonify({"imported": len(data)})


@app.get("/export")
def export():
    name = request.args.get("name", "orders")
    output = subprocess.check_output("tar czf /tmp/" + name + ".tgz /app", shell=True)
    return output


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
