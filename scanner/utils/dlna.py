#! /usr/bin/env python
# -*- coding: utf-8 -*-


import upnpclient
import xml.etree.ElementTree as ET
import json


def parse_dlna(dlna_server):
    """
    Return a dict of title: url from dlna
    """
    res = [
        s
        for s in upnpclient.Device("http://{}/rootDesc.xml".format(dlna_server)).services
        if s.name == "ContentDirectory"
    ][0].Browse(
        ObjectID="2$8",
        BrowseFlag="BrowseDirectChildren",
        Filter="",
        StartingIndex=0,
        RequestedCount=100000,
        SortCriteria="",
    )[
        "Result"
    ]

    root = ET.fromstring(res)

    return {item[0].text: item[3].text for item in root}


if __name__ == '__main__':
    import argparse
    import sys

    parser = argparse.ArgumentParser(description="DLNA Client")
    parser.add_argument("--dlnaserver_ip", help="DLNA Server IP", required=True)
    args = vars(parser.parse_args())
    sys.argv = [sys.argv[0]]

    print(json.dumps(parse_dlna(args['dlnaserver_ip'])))
