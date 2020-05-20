<?php
/**
 * Plugin Name: DPSG Stammesauswahl Contact Form 7
 * Author: Leo Decking
 * Description: Auswahl von Diözesanverband / Bezirk / Stamm für Contact Form 7
 */

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

    return 
      '<div>
        <label>Diözesanverband:</label> <select name="dv" id="stammesauswahl-dv" defaultValue="'.esc_attr( $defaultValues[0] ).'"></select><br/>
        <label>Bezirk:</label> <select name="bezirk" id="stammesauswahl-bezirk" defaultValue="'.esc_attr( $defaultValues[1] ).'"></select><br/>
        <label>Stamm:</label> <span class="wpcf7-form-control-wrap '.esc_attr($name).'"><select name="'.esc_attr($name).'" id="stammesauswahl-stamm" defaultValue="'.esc_attr( $defaultValues[2] ).'"></select></span>
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



add_action( 'admin_menu', 'stammesauswahl_add_settings_page' );
function stammesauswahl_add_settings_page() {
  add_options_page( 'Stammesauswahl Einstellungen', 'Stammesauswahl', 'manage_options', 'stammesauswahl_settings', 'stammesauswahl_render_plugin_settings_page' );
}

function stammesauswahl_render_plugin_settings_page() {
  ?>
  <form action="options.php" method="post">
      <?php 
      settings_fields( 'stammesauswahl_plugin_options' );
      do_settings_sections( 'stammesauswahl_settings' ); ?>
      <input name="submit" class="button button-primary" type="submit" value="Speichern"/>
  </form>
  <?php
}

add_action( 'admin_init', 'stammesauswahl_register_settings' );
function stammesauswahl_register_settings() {
  register_setting( 'stammesauswahl_plugin_options', 'stammesauswahl_plugin_options', array( 'sanitize_callback' => 'stammesauswahl_sanitize_options' )  );
  
  add_settings_section( 'stammesauswahl_section', 'Stammesauswahl Einstellungen', 'dbi_plugin_section_text', 'stammesauswahl_settings' );

  add_settings_field( 'stammesauswahl_setting_groups', 'Gruppierungen:', 'stammesauswahl_setting_groups', 'stammesauswahl_settings', 'stammesauswahl_section' );
  add_settings_field( 'stammesauswahl_setting_paste', 'Hier einfügen:', 'stammesauswahl_setting_paste', 'stammesauswahl_settings', 'stammesauswahl_section' );
  add_settings_field( 'stammesauswahl_setting_hidden', '', 'stammesauswahl_setting_hidden', 'stammesauswahl_settings', 'stammesauswahl_section' );
 }

function stammesauswahl_sanitize_options( $input ) {
  // $input['api_key'] = trim( $input['api_key'] );
  // if ( ! preg_match( '/^[a-z0-9]{32}$/i', $input['api_key'] ) ) {
  //     $input['api_key'] = '';
  // }
// echo $input;
  // return $newinput;
  // $input['paste']=strlen($input['paste']);
  return $input;
}


function dbi_plugin_section_text() {
  echo '<p>Here you can set all the options for using the API</p>';
}

function stammesauswahl_setting_groups() {
  $options = get_option( 'stammesauswahl_plugin_options' );

  wp_enqueue_script( 'stammesauswahl-script',plugins_url( '/stammesauswahl.js', __FILE__ ),[]);
  wp_enqueue_script( 'stammesauswahl-admin-script',plugins_url( '/stammesauswahl-admin.js', __FILE__ ),[]);
  echo 
    '<div>
      <label>Diözesanverband: <i id="dv-count"></i></label> <select  id="stammesauswahl-dv"></select><br/>
      <label>Bezirk: <i id="bezirk-count"></i></label> <select id="stammesauswahl-bezirk"></select><br/>
      <label>Stamm: <i id="stamm-count"></i></label> <select id="stammesauswahl-stamm"></select></span>
    </div>';
}

function stammesauswahl_setting_paste() {
  echo '<textarea id="stammesauswahl_plugin_paste"></textarea>
  <input id="paste-button" class="button button-secondary" type="button" value="Auslesen"/>';
}

function stammesauswahl_setting_hidden() {
  $options = get_option( 'stammesauswahl_plugin_options' );

  echo '<input id="stammesauswahl_setting_hidden" name="stammesauswahl_plugin_options[groups]" type="text" value="'.esc_attr( $options['groups'] ).'">';
}