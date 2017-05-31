<?php
$g = json_decode("{}");
$g->debug = false;
$g->in_dir = "/var/lq/";
$g->out_dir = "/var/lq/";
$g->in_file = "20170531_trigger_first_100.csv";
$g->out_debug = "20170531_trigger_first_100_debug.out";
$g->out_contact = "20170531_trigger_first_100_contact.out";
$g->out_event = "20170531_trigger_first_100_event.out";
$g->out_supplement = "20170531_trigger_first_100_supplement.out";
$g->in_handle = fopen($g->in_dir . $g->in_file, "r");
$g->out_debug_handle = fopen($g->out_dir . $g->out_debug, "w");
$g->out_contact_handle = fopen($g->out_dir . $g->out_contact, "w");
$g->out_event_handle = fopen($g->out_dir . $g->out_event, "w");
$g->out_supplement_handle = fopen($g->out_dir . $g->out_supplement, "w");
$g->have_read_header = false;
$g->read_header = json_decode('{"EMAIL":{"column":0,"map_debug":"EMAIL","map_contact":"","map_event":"","map_supplement":""},"FIRSTNAME":{"column":1,"map_debug":"FIRSTNAME","map_contact":"","map_event":"","map_supplement":""},"LASTNAME":{"column":2,"map_debug":"LASTNAME","map_contact":"","map_event":"","map_supplement":""},"ADDRESS":{"column":3,"map_debug":"ADDRESS","map_contact":"","map_event":"","map_supplement":""},"CITY":{"column":4,"map_debug":"CITY","map_contact":"","map_event":"","map_supplement":""},"STATE":{"column":5,"map_debug":"STATE","map_contact":"","map_event":"","map_supplement":""},"COUNTRY":{"column":6,"map_debug":"COUNTRY","map_contact":"","map_event":"","map_supplement":""},"POSTAL_CODE":{"column":7,"map_debug":"POSTAL_CODE","map_contact":"","map_event":"","map_supplement":""},"GENDER":{"column":8,"map_debug":"GENDER","map_contact":"","map_event":"","map_supplement":""},"ARRIVAL":{"column":9,"map_debug":"ARRIVAL","map_contact":"","map_event":"","map_supplement":""},"CHILDREN":{"column":10,"map_debug":"CHILDREN","map_contact":"","map_event":"","map_supplement":""},"PROPERTY":{"column":11,"map_debug":"PROPERTY","map_contact":"","map_event":"","map_supplement":""},"GRP":{"column":12,"map_debug":"GRP","map_contact":"","map_event":"","map_supplement":""}}');
if(isset($_GET["debug"]) && $_GET["debug"] === "true"){
  $g->debug = true;
}

function getHeader($row){
  $results = json_decode("{}");
  $i = 0;
  foreach($row as $column){
    $results->$column = $i;
    $i++;
  }
  return $results;
}