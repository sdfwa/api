<?php
if(isset($_GET['file']) && isset($_GET['file']) !== ''){
  $file = $_GET['file'];
  $image = file_get_contents('/var/shop/motion/'.$file);
  header('Content-type: image/jpeg;');
  header("Content-Length: " . strlen($image));
  echo $image;
}else{
  $handle = opendir('/var/shop/motion/');
  $files = array();
  while($file = readdir($handle)){
    if($file !== '.' && $file !== '..' && preg_match('/\.jpg$/i', $file)){
      array_push($files, $file);
    }
  }
  rsort($files);
  foreach($files as $file){
    //echo '<img src="attempts.php/?file='.urlencode($file).'" border="0" /><br>';
    echo '<a href="attempts.php/?file='.urlencode($file).'">'.$file.'</a><br>';
  }
}
?>