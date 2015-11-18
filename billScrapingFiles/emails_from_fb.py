import requests
import time
if __name__=="__main__":
	r = requests.get("https://yig-bill-tracker.firebaseio.com/emailList/.json")
	if r.status_code == requests.codes.ok:
		j = r.json()
		emails = []
		for emailFB in j:
			if j[emailFB][u'emailAddress'] not in emails:
				emails.append( j[emailFB][u'emailAddress'] )
		print len(emails)
		emails = [ str(n) for n in emails ]
		f = open("emails_second_round.csv","w")
		for email in emails:
			f.write("Delegate, from YIG,"+str(email).lower()+"\n")
		f.close()
	else:
		print "Error retrieving the information"


from selenium import webdriver

d = webdriver.Chrome()
# https://itunesconnect.apple.com/WebObjects/iTunesConnect.woa/ra/ng/app/1058480145/testflight/external

d.get("https://itunesconnect.apple.com/itc/static/login?view=1&path=%2FWebObjects%2FiTunesConnect.woa")
time.sleep(20)
d.find_element_by_css_selector("#appleId").send_keys("jesus.barberis.canonico@gmail.com")


