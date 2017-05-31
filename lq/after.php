<?php
fclose($g->read_file);
fclose($g->write_test);
if($g->debug === true){
  echo "<pre>";
  print_r($g);
  echo "</pre>";
}