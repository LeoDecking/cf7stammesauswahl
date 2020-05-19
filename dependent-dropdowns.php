<?php
/**
 * Plugin Name: Dependent Dropdowns for Contact Form 7
 * Author: Leo Decking
 */

add_action( 'wpcf7_init', 'custom_add_form_tag_stamm' );
 
function custom_add_form_tag_stamm() {
  wpcf7_add_form_tag( array('stamm','stamm*'), 'custom_stamm_form_tag_handler', array( 'name-attr' => true ) );
}
 
 
function custom_stamm_form_tag_handler( $tag ) {
    if( ! $tag instanceof WPCF7_FormTag ) return '';

    wp_enqueue_script( 'dependent-dropdowns-script',plugins_url( '/dependent-dropdowns.js', __FILE__ ),[]);

    $name = $tag->name;
    if($name=='')$name='stamm';

    $defaultValues = $tag->values;

    return 
      '<div>
        <label>Diözesanverband:</label> <select name="dv" id="dependent-dropdowns-dv" defaultValue="'.esc_attr( $defaultValues[0] ).'"></select><br/>
        <label>Bezirk:</label> <select name="bezirk" id="dependent-dropdowns-bezirk" defaultValue="'.esc_attr( $defaultValues[1] ).'"></select><br/>
        <label>Stamm:</label> <span class="wpcf7-form-control-wrap '.esc_attr($name).'"><select name="'.esc_attr($name).'" id="dependent-dropdowns-stamm" defaultValue="'.esc_attr( $defaultValues[2] ).'"></select></span>
      </div>';
}

add_filter( 'wpcf7_validate_stamm*', 'custom_stamm_confirmation_validation_filter', 20, 2 );
  
function custom_stamm_confirmation_validation_filter( $result, $tag ) {  
  $name = $tag->name;

  if ((isset( $_POST[$name] ) ? trim( $_POST[$name] ) : '---' ) == '---') {
    $result->invalidate( $tag, wpcf7_get_message( 'invalid_required' ) );
  }
  
  return $result;
}