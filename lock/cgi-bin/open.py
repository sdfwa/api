#!/usr/bin/python
import os, sys, time, datetime, urlparse
try:
  member_id = sys.argv[1]
except:
  try:
    member_id = self.request.GET.get('member_id')
  except:
    member_id = '0000'
os.system("gpio -g mode 4 out; gpio -g write 4 1; gpio -g write 4 0;")
os.system('curl -F "memberId=' + member_id + '" -F "submit=submit" -F "status=success" -F "fileToUpload=@/ram/motion.jpg" "https://shop.sdfwa.org/lock/upload.php"')