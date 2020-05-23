<?php
/**
 * Plugin Name: DPSG Stammesauswahl Contact Form 7
 * Author: Leo Decking
 * Description: Auswahl von Diözesanverband / Bezirk / Stamm für Contact Form 7
 */
include_once('stammesauswahl-settings.php');

add_action( 'wpcf7_init', 'custom_add_form_tag_stamm' );
function custom_add_form_tag_stamm() {
  wpcf7_add_form_tag( array('stamm','stamm*'), 'custom_stamm_form_tag_handler', array( 'name-attr' => true ) );
}
 
 
function custom_stamm_form_tag_handler( $tag ) {
    if( ! $tag instanceof WPCF7_FormTag ) return '';

    wp_enqueue_script( 'stammesauswahl-script',plugins_url( '/stammesauswahl.js', __FILE__ ),[]);

    $name = $tag->name;
    if($name=='')$name='stamm';

    $defaultValues = $tag->values;
    
    $options = get_option( 'stammesauswahl_plugin_options' );
     
    return '<style>.stammesauswahl td {padding: 2px!important;}</style>'.
      '<table class="stammesauswahl" groups="'.esc_attr( $options['groups'] ).'">
        <tr><td><label>Diözesanverband:</label></td><td><select  name="'.esc_attr($name).'-dv" class="stammesauswahl-dv" defaultValue="'.esc_attr( $defaultValues[0] ).'"></select></td></tr>
        <tr><td><label>Bezirk:</label></td><td><select name="'.esc_attr($name).'-bezirk" class="stammesauswahl-bezirk" defaultValue="'.esc_attr( $defaultValues[1] ).'"></select></td></tr>
        <tr><td><label>Stamm:</label></td><td><span class="wpcf7-form-control-wrap '.esc_attr($name).'"><select name="'.esc_attr($name).'" class="stammesauswahl-stamm" defaultValue="'.esc_attr( $defaultValues[2] ).'"></select></span></td></tr>
      </table>';
}

add_filter( 'wpcf7_validate_stamm*', 'custom_stamm_confirmation_validation_filter', 20, 2 );
  function custom_stamm_confirmation_validation_filter( $result, $tag ) {  
  $name = $tag->name;

  if ((isset( $_POST[$name] ) ? trim( $_POST[$name] ) : '---' ) == '---') {
    $result->invalidate( $tag, wpcf7_get_message( 'invalid_required' ) );
  }
  
  return $result;
}