from parser import *

if __name__=="__main__":
	billInfo = BillsInfo("2015_HS_PREMIER_HOUSE_BILLS.txt")
	for bill in billInfo.bills:
		print str(bill)
		try:
			save_yes_no = raw_input("press k to save to firebase: ")
			if (save_yes_no.lower() == 'k'):
				bill.saveToFB()
			else:
				ask2 = """
				What do you want to change? 
				\n 0: origin
				\n 1: number
				\n 2: committee
				\n 3: authors
				\n 4: sponsor
				\n 5: school
				\n 6: title
				\n 7: text
				\n e: exit
				\n s: save
				"""
				change_something  = raw_input(ask2)
				while change_something != 'e' and change_something != 's':
					change_something = int(change_something)
					if change_something == 0:
						bill.data[0] = raw_input("\n Origin: ")
					elif change_something == 1:
						bill.data[1] = raw_input("\n Number: ")
					elif change_something == 2:
						bill.data[2] = raw_input("\n committee: ")
					elif change_something == 3:
						bill.data[3] = raw_input("\n authors: ")
					elif change_something == 4:
						bill.data[4] = raw_input("\n sponsor: ")
					elif change_something == 5:
						bill.data[5] = raw_input("\n school: ")
					elif change_something == 6:
						bill.data[6] = raw_input("\n title: ")
					elif change_something == 7:
						bill.data[7] = raw_input("\n text: ")
					print str(bill)
					change_something  = raw_input(ask2)
				if change_something == 'e':
					continue
				elif change_something == 's':
					bill.saveToFB()
		except:
			print bill.parseAsDict()
		# save_yes_no = raw_input("press k to save to firebase: ")
		# if (save_yes_no.lower() == 'k'):


