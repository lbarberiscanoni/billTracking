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
	def post_candidate(self, data):
		url = self.to_url("candidates")
		print url
		r = requests.post(url = url, data=json.dumps(data))
		if r.status_code == requests.codes.ok:
			json_r = r.json()
			if 'name' in json_r:
				url = self.to_url("candidates/"+json_r['name'])
				dataFollow = {}
				dataFollow["id"] = json_r['name']
				r = requests.patch(url = url, data=json.dumps(dataFollow))
				return json_r
			return None
		else:
			return None


if __name__=="__main__":
	keepGoing = True
	connection = RemoteConnection("jesus")
	candidateInfo = {}
	while keepGoing == True:
		try:
			save_yes_no = raw_input("Do you want to continue? (y,n): ")
			if (save_yes_no.lower() == 'n'):
				keepGoing = False
				break
			else:
				print candidateInfo
				ask2 = """
				What do you want to change? 
				\n 0: conference-role
				\n 1: graduation-year
				\n 2: name
				\n 3: office
				\n 4: party
				\n 5: school
				\n 6: slogan
				\n 7: statement
				"""
				change_something  = raw_input(ask2)
				while change_something != 'e' and change_something != 's':
					change_something = int(change_something)
					if change_something == 0:
						candidateInfo["conference-role"] = raw_input("\n conference-role: ")
					elif change_something == 1:
						candidateInfo["graduation-year"] = raw_input("\n graduation-year: ")
					elif change_something == 2:
						candidateInfo["name"] = raw_input("\n name: ")
					elif change_something == 3:
						candidateInfo["office"] = raw_input("\n office: ")
					elif change_something == 4:
						candidateInfo["party"] = raw_input("\n party: ")
					elif change_something == 5:
						candidateInfo["school"] = raw_input("\n school: ")
					elif change_something == 6:
						candidateInfo["slogan"] = raw_input("\n slogan: ")
					elif change_something == 7:
						candidateInfo["statement"] = raw_input("\n statement: ")
					# print str(bill)
					print candidateInfo
					change_something  = raw_input(ask2)
				if change_something == 'e':
					continue
				elif change_something == 's':
					connection.post_candidate(candidateInfo)
		except:
			print "Error while saving data"
		# save_yes_no = raw_input("press k to save to firebase: ")
		# if (save_yes_no.lower() == 'k'):
