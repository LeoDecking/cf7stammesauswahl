<?php
/**
 * Plugin Name: DPSG Stammesauswahl for Contact Form 7
 * Plugin URI: https://github.com/leodecking/cf7stammesauswahl
 * Author: Leo Decking
 * Description: Auswahl von DPSG-Diözesanverband / Bezirk / Stamm für Contact Form 7
 * License: GPLv2
 * Version: 1.2
 */
include_once('cf7stammesauswahl-settings.php');

register_uninstall_hook(__FILE__, 'uninstall_plugin_cf7stammesauswahl');
function uninstall_plugin_cf7stammesauswahl() {
    delete_option('cf7stammesauswahl_plugin_options');
}

add_action( 'wpcf7_init', 'custom_add_form_tag_stamm' );
function custom_add_form_tag_stamm() {
  wpcf7_add_form_tag( array('stamm','stamm*'), 'custom_stamm_form_tag_handler', array( 'name-attr' => true ) );
}
 
 
function custom_stamm_form_tag_handler( $tag ) {
    if( ! $tag instanceof WPCF7_FormTag ) return '';
    
    global $is_IE;
    if($is_IE) {
      wp_enqueue_script( 'cf7stammesauswahl-script',plugins_url( '/cf7stammesauswahl-es2015.js', __FILE__ ),[]);
      wp_enqueue_script( 'polyfills',plugins_url( '/polyfill.min.js', __FILE__ ),[]);
    } else {
      wp_enqueue_script( 'cf7stammesauswahl-script',plugins_url( '/cf7stammesauswahl.js', __FILE__ ),[]);
    }
    
    $name = $tag->name;
    if($name=='')$name='stamm';

    $defaultValues = $tag->values;
    
    $requiredClass = " wpcf7-validates-as-required";
    if(($tag->type)=="stamm") $requiredClass="";
    
    $options = get_option( 'cf7stammesauswahl_plugin_options' );
     
    return '<style>.cf7stammesauswahl label {width: 65px}</style>'.
      '<div class="cf7stammesauswahl" groups="'.esc_attr( $options['groups'] ).'">
        <label>DV:</label><span class="wpcf7-form-control-wrap"><select class="cf7stammesauswahl-dv wpcf7-form-control wpcf7-select'.$requiredClass.'" defaultValue="'.esc_attr( $defaultValues[0] ).'"></select></span><br/>
        <label>Bezirk:</label><span class="wpcf7-form-control-wrap"><select class="cf7stammesauswahl-bezirk wpcf7-form-control wpcf7-select'.$requiredClass.'" defaultValue="'.esc_attr( $defaultValues[1] ).'"></select></span><br/>
        <label>Stamm:</label><span class="wpcf7-form-control-wrap '.esc_attr($name).'">
          <select class="cf7stammesauswahl-stamm wpcf7-form-control wpcf7-select'.$requiredClass.'" defaultValue="'.esc_attr( $defaultValues[2] ).'"></select>
          <input name="'.esc_attr($name).'" class="cf7stammesauswahl-custom-stamm wpcf7-form-control wpcf7-text'.$requiredClass.'" style="display:none"/>
          <input name="'.esc_attr($name).'-bezirk" class="cf7stammesauswahl-form-bezirk" style="display:none"/>
          <input name="'.esc_attr($name).'-dv" class="cf7stammesauswahl-form-dv" style="display:none"/>
          </span><br/>
          <a class="cf7stammesauswahl-custom">Stamm nicht dabei?</a><a class="cf7stammesauswahl-select" style="display:none">Stamm auswählen</a>
      </div>';
}

add_filter( 'wpcf7_validate_stamm*', 'custom_stamm_confirmation_validation_filter', 20, 2 );
function custom_stamm_confirmation_validation_filter( $result, $tag ) {  
  $name = $tag->name;

  if ((isset( $_POST[$name] ) ? trim( str_replace('-','', $_POST[$name] )) : '' ) == '') {
    $result->invalidate( $tag, wpcf7_get_message( 'invalid_required' ) );
  }
  
  return $result;
}