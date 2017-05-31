<?php
fclose($g->in_handle);
fclose($g->out_test_handle);
fclose($g->out_contact_handle);
fclose($g->out_event_handle);
fclose($g->out_supplement_handle);
if($g->debug === true){
  echo "<pre>";
  print_r($g);
  echo "</pre>";
}