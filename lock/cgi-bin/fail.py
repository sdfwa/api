#!/usr/bin/python
import os, sys, time, datetime, urlparse
try:
  member_id = sys.argv[1]
except:
  try:
    member_id = self.request.GET.get('member_id')
  except:
    member_id = '0000'
os.system('curl -F "memberId=' + member_id + '" -F "submit=submit" -F "status=fail" -F "fileToUpload=@/ram/motion.jpg" "https://shop.sdfwa.org/lock/upload.php"')