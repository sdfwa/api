<?php
require_once('./helper.php');
$g->read_file = fopen($g->local_dir . $g->local_in_file, "r");
$g->write_file = fopen($g->local_dir . $g->local_out_file, "w");
while (($g->row = fgetcsv($g->read_file)) !== false) {
    $id = array_shift($g->row);
    $g->row[2] = str_getcsv($g->row[2], ",");
    fwrite($g->write_file, $g->row);
}
fclose($g->read_file);
fclose($g->write_file);
?>