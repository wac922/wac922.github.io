<?php
/**
 * Created by PhpStorm.
 * User: wac92
 * Date: 2017/5/8
 * Time: 上午 11:05
 */
 $goods = isset($_GET['goods']) ? $_GET['goods'] : '';

 switch ($goods){
     case 'b-01':
         echo 40;
     break;
     case 'b-02':
         echo 50;
         break;
     case 'b-03':
         echo 100;
         break;
     case 'c-01':
         echo 60;
         break;
     case 'c-02':
         echo 70;
         break;
     case 'c-03':
         echo 80;
         break;
     case 'c-04':
         echo 55;
         break;
     default:
         echo 0;
 }


 //
// if ($goods == 'b-01'){?>
<!--<span>40</span>-->
<?php //}elseif ($goods == 'b-02'){?>
<!--    <span>50</span>-->
<!-- --><?php //}elseif ($goods == 'b-03'){?>
<!--     <span>100</span>-->
<!-- --><?php //}elseif ($goods == 'c-01'){?>
<!--     <span>60</span>-->
<!-- --><?php //}elseif ($goods == 'c-02'){?>
<!--     <span>75</span>-->
<!-- --><?php //}elseif ($goods == 'c-03'){?>
<!--     <span>90</span>-->
<!-- --><?php //}elseif ($goods == 'c-04'){?>
<!--     <span>80</span>-->
<?php //} ?>