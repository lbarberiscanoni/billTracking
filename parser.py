import os
import re
import requests
import json

class RemoteConnection:
	TOKENS = {
		"jesus":"SrnTxDeDHNnETjwfDVxOSc930oaIdMdI6NsUNqBk"
		}
	FIREBASE_URL = "https://yig-bill-tracker.firebaseio.com/"
	def __init__(self, name = "jesus"):
		assert name in self.TOKENS
		self.token = self.TOKENS[name]
		self.name = name
		self.ending = "?auth="+self.token
	def to_url(self, stringT):
		assert stringT[0] != "/"
		return self.FIREBASE_URL+stringT+"/.json"+self.ending
	def post_bill(self, data):
		url = self.to_url("bills/")
		print url
		r = requests.post(url = url, data=json.dumps(data))
		if r.status_code == requests.codes.ok:
			json_r = r.json()
			if 'name' in json_r:
				url = self.to_url("bills/"+json_r['name'])
				dataFollow = {}
				dataFollow["id"] = json_r['name']
				r = requests.patch(url = url, data=json.dumps(dataFollow))
				return json_r
			return None
		else:
			return None



class Bill:
	""" Receives the data for a bill as a string """
	def cleanTrailingSpace(self, text):
		try:
			if text == "":
				return ""
			elif len(text) == 1:
				if ord(text) <= 32:
					return ""
			result = ""
			i = 0
			j = len(text)
			l = len(text)
			while text[i] == " ":
				if (i+1) == j:
					break
				i += 1
			j -= 1
			while text[j] == " ":
				if (j-1) == 0:
					break
				j -= 1
			if j != 0 and j != (l-1):
				return text[i:j+1]
			elif j == (l-1):
				return text[i:]
		except:
			print "CRASHED"
			print len(text)
			print ord(text)
	def __init__(self, text):
		# adds the bill originates because it is removed from when I split
		self.raw = "BILL ORIGINATES IN:" + text
		self.lower_raw = self.raw.lower()
		params = [
			"BILL ORIGINATES IN:",
			"BILL NUMBER:",
			"RECOMMENDED FOR COMMITTEE:",
			"AUTHORS:",
			"BILL SPONSOR:",
			"SCHOOL/CLUB:",
			"A BILL TO BE ENTITLED",
			"BE IT HEREBY ENACTED BY THE YMCA MODEL LEGISLATURE OF SOUTH CAROLINA"
		]
		self.data = []
		for i in range(len(params)-1):
			self.data.append( self.cleanTrailingSpace( self.raw[ self.raw.find(params[i]) + len(params[i]) : self.raw.find(params[i+1]) ] ) )
		rest = self.raw[ self.raw.find(params[-1]) + len(params[-1]) : ].replace("SOUTH CAROLINA YMCA YOUTH IN GOVERNMENT 28th Annual Model Legislature November 18-21, 2015","")
		# Obtain the sections
		self.sections = []
		rest_lower = rest.lower()
		keepGoing = True
		m = "section"
		l = len(m)
		kCounter = 0
		while keepGoing:
			i = rest_lower.find(m)
			if i == -1:
				keepGoing = False
				break
			i += l
			j = rest_lower[i+l:].find(m)
			if j == -1:
				self.sections.append(self.cleanTrailingSpace(rest[i:]))
				keepGoing = False
				break
			j += i + l
			if rest == "":
				break
			self.sections.append(self.cleanTrailingSpace(rest[i:j]))
			rest = rest[j-l-3:]
			rest_lower = rest.lower()
			kCounter += 1
			if kCounter == 100:
				print "The number of sections should not be this high"
				raise
		self.connection = RemoteConnection("jesus")
		self.data.append("<h3>Section</h3>" + ' <h3>Section</h3> '.join(self.sections))
	def parseAsDict(self):
		result = {}
		result["originates"] = self.data[0]
		result["number"] = self.data[1]
		result["committee"] = self.data[2]
		result["authors"] = self.data[3].replace("PREMIER SENATE", "")
		result["sponsor"] = self.data[4]
		result["school"] = self.data[5]
		result["title"] = self.data[6]
		result["text"] = self.data[7]
		return result
	def saveToFB(self):
		temp = self.parseAsDict()
		authors = [ self.cleanTrailingSpace(n) for n in temp["authors"].replace(";"," and ").split("and") ]
		l = {
			"author1": authors[0],
			"author2": authors[1],
			"authorLocation": "not yet assigned",
			"billLocation": temp["committee"],
			"billStatus": "on the docket",
			"billText": temp["text"],
			"billTitle": temp["title"],
			"division": temp["originates"],
			"governorEvaluation": "not yet evaluated",
			"id": "-K3HqH0G5xJKm1k6nP3O",
			"rocketDocketStatus": "no",
			"school": temp["school"],
			"sponsor": temp["sponsor"]
			}
		return self.connection.post_bill(l)
	def __str__(self):
		result = ""
		t = self.parseAsDict()
		keys = t.keys()
		for key in keys:
			result += "\n"+ "*"*50 + "\n"
			result += key + ":		"
			result += t[key] + "\n" + "*"*50+ "\n"
		return result


class BillsInfo:
	""" A collection of bills, from a main file """
	def __init__(self, path):
		self.path = path
		f = open(self.path, 'r')
		self.raw = f.read()
		self.clean = ""
		for i in self.raw:
			Oi = ord(i)
			if Oi < 128 and Oi != 10 and Oi != 9 and Oi > 31:
				self.clean += i
			elif Oi == 10:
				self.clean += ' '
			elif Oi == 9:
				self.clean += ' '
		f.close()
		self.bills = []
		self.bills_raw = self.clean.split("BILL ORIGINATES IN:")
		self.bills_count = len(self.bills)
		i = 0
		for bill_raw in self.bills_raw:
			if i == 0:
				i += 1
				continue
			self.bills.append(Bill(bill_raw))
			i += 1