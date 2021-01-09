import inspect
import sys

from invoke import task

@task
def lint(c):
    c.run("black -t py38 cfnsane/*")
    c.run("pylint cfnsane/*")

@task
def unit(c, test="*", pre=""):
    cmd = "{} pytest -vvv tests/unit/{}".format(pre, test)
    print(cmd)
    c.run(cmd)

@task
def debug(c, test="*", port="5678"):
    pre = "python -m debugpy --wait-for-client --listen 0.0.0.0:{} -m".format(port)
    unit(c, test=test, pre=pre)
