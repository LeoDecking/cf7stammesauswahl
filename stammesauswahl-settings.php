<?php

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
  register_setting( 'stammesauswahl_plugin_options', 'stammesauswahl_plugin_options');
  
  add_settings_section( 'stammesauswahl_section', 'Stammesauswahl Einstellungen', 'dbi_plugin_section_text', 'stammesauswahl_settings' );

  add_settings_field( 'stammesauswahl_setting_paste', 'Hier einfügen:', 'stammesauswahl_setting_paste', 'stammesauswahl_settings', 'stammesauswahl_section' );
  add_settings_field( 'stammesauswahl_setting_hidden', '', 'stammesauswahl_setting_hidden', 'stammesauswahl_settings', 'stammesauswahl_section' );
  add_settings_field( 'stammesauswahl_setting_groups', 'Gruppierungen:', 'stammesauswahl_setting_groups', 'stammesauswahl_settings', 'stammesauswahl_section' );
 }

function dbi_plugin_section_text() {
  echo '<p>Füge den Inhalt der <a target="_blank" href="https://dpsg.de/de/ueber-uns/satzung-ordnung-konzepte/ordnung-satzung.html">aktuellen Liste der Gruppierungen</a> in das Textfeld ein, um die Gruppierungen zu aktualisieren.</p>';
}


function stammesauswahl_setting_paste() {
  echo '<textarea id="stammesauswahl_plugin_paste"/></textarea>
  <input id="paste-button" class="button button-secondary" type="button" value="Auslesen"/>';
}

function stammesauswahl_setting_hidden() {
  $options = get_option( 'stammesauswahl_plugin_options' );
  
  echo '<input id="stammesauswahl_setting_hidden" name="stammesauswahl_plugin_options[groups]" type="text" value="'.esc_attr( $options['groups'] ).'">';
}

function stammesauswahl_setting_groups() {
  $options = get_option( 'stammesauswahl_plugin_options' );

  wp_enqueue_script( 'stammesauswahl-script',plugins_url( '/stammesauswahl.js', __FILE__ ),[]);
  wp_enqueue_script( 'stammesauswahl-admin-script',plugins_url( '/stammesauswahl-admin.js', __FILE__ ),[]);
  echo '<style>.stammesauswahl td {padding: 2px!important;}</style>';
  echo 
    '<table class="stammesauswahl" groups="'.esc_attr( $options['groups'] ).'">
      <tr><td><label>Diözesanverband: <i class="dv-count"></i></label></td><td><select class="stammesauswahl-dv"></select></td></tr>
      <tr><td><label>Bezirk: <i class="bezirk-count"></i></label></td><td><select class="stammesauswahl-bezirk"></select></td></tr>
      <tr><td><label>Stamm: <i class="stamm-count"></i></label></td><td><select class="stammesauswahl-stamm"></select></td></tr>
    </table>';
}