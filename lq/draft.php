<?php
/* Start helper funstions */
function getHeader($row){
  $results = json_decode("{}");
  $i = 0;
  foreach($row as $column){
    $results->$column = $i;
    $i++;
  }
  return $results;
}

function getKeyNames($json){
  $results = json_decode("[]");
  foreach($json as $key => $value){
    array_push($results, $key);
  }
  return $results;
}

function exit_code($error, $g){
  if(isset($error)){
    $g->error = $error;
  }
  if($g->debug === true){
    echo "<pre>";
    print_r($g);
    echo "</pre>";
  }
}
/* End helper funstions */

/* Start Config Setup */
$g = json_decode("{}");
$g->debug = false;
$g->in_config_dir = "/var/github/shop/lq/";
$g->in_dir = "/var/lq/";
$g->out_dir = "/var/lq/";
$g->in_file = "20170531_trigger_first_100.csv";
$g->in_mapping_file = "mapping.json";
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
$g->mappings = json_decode(file_get_contents($g->in_config_dir . $g->in_mapping_file));
$g->mappings_keys = getKeyNames($g->mappings);
$g->mappings_keys_count = count($g->mappings_keys);

if(isset($_GET["debug"]) && $_GET["debug"] === "true"){
  $g->debug = true;
}
/* End Config Setup */

/* Start processing Rows */
while (($row = fgetcsv($g->in_handle)) !== false) {
  $g->write_debug = false;
  $g->write_contact = false;
  $g->write_event = false;
  $g->write_supplement = false;
  $results_debug = json_decode("[]");
  $results_contact = json_decode("[]");
  $results_event = json_decode("[]");
  $results_supplement = json_decode("[]");
  if(!$g->have_read_header){
    $g->have_read_header = true;
    if($g->debug){
      if($g->mappings_keys_count === count($row)){
        exit_code('key counts in input file does not match mappings', $g);
      }
      foreach($row as $column){
        if(isset($g->mappings->$column)){ // is the column in the mapping? 
          exit_code('key found in input file does not match mappings', $g);
        }
      }
      foreach($g->mappings_keys as $header){
        $g->write_debug = true;
        $results_debug = getHeader($g->mappings_keys);
      }
    }  
  }else{
    if($g->debug){
      $g->write_debug = true;
      foreach($row as $column){
        array_push($results_debug, trim($column));
      }
    } 
  }
  if($g->write_debug){
    fputcsv($g->out_debug_handle, $results_debug);
  }
  if($g->write_contact){
    fputcsv($g->out_contact_handle, $results_contact);
  }
  if($g->write_event){
    fputcsv($g->out_event_handle, $results_event);
  }
  if($g->write_supplement){
    fputcsv($g->out_supplement_handle, $results_supplement);
  }
}
/* End processing rows */

/* Start Cleanup and Send */
fclose($g->in_handle);
fclose($g->out_debug_handle);
fclose($g->out_contact_handle);
fclose($g->out_event_handle);
fclose($g->out_supplement_handle);
exit_code(null, $g);
/* End Cleanup and Send */
?>