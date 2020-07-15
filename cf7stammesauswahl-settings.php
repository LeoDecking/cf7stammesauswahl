<?php

add_action( 'admin_menu', 'cf7stammesauswahl_add_settings_page' );
function cf7stammesauswahl_add_settings_page() {
  add_options_page( 'Stammesauswahl Einstellungen', 'Stammesauswahl', 'manage_options', 'cf7stammesauswahl_settings', 'cf7stammesauswahl_render_plugin_settings_page' );
}

function cf7stammesauswahl_render_plugin_settings_page() {
  ?>
  <form action="options.php" method="post">
      <?php 
      settings_fields( 'cf7stammesauswahl_plugin_options' );
      do_settings_sections( 'cf7stammesauswahl_settings' ); ?>
      <input name="submit" class="button button-primary" type="submit" value="Speichern"/>
  </form>
  <?php
}

add_action( 'admin_init', 'cf7stammesauswahl_register_settings' );
function cf7stammesauswahl_register_settings() {
  register_setting( 'cf7stammesauswahl_plugin_options', 'cf7stammesauswahl_plugin_options');
  
  add_settings_section( 'cf7stammesauswahl_section', 'Stammesauswahl Einstellungen', 'dbi_plugin_section_text', 'cf7stammesauswahl_settings' );

  add_settings_field( 'cf7stammesauswahl_setting_groups', 'Gruppierungen:', 'cf7stammesauswahl_setting_groups', 'cf7stammesauswahl_settings', 'cf7stammesauswahl_section' );
  add_settings_field( 'cf7stammesauswahl_setting_paste', 'Aktualisieren:', 'cf7stammesauswahl_setting_paste', 'cf7stammesauswahl_settings', 'cf7stammesauswahl_section' );
  add_settings_field( 'cf7stammesauswahl_setting_hidden', '', 'cf7stammesauswahl_setting_hidden', 'cf7stammesauswahl_settings', 'cf7stammesauswahl_section' );
 }

function dbi_plugin_section_text() {
  echo
  '<p>Füge den <code>[stamm]</code>-Tag in dein Kontaktformular ein: <code>[stamm(*) feldname "Standard-DV" "Standard-Bezirk" "Standard-Stamm"]</code>
  <p>Mit dem <code>*</code> legst du fest, ob das Stammes-Feld erforderlich ist. Standard-Stamm/-Bezirk/-DV sind natürlich optionale Angaben ;)</p>
  <p>Du kannst anschließend folgende Tags in der E-Mail verwenden: <code>[feldname]</code>, <code>[feldname-bezirk]</code>, <code>[feldname-dv]</code></p>
  <p>Ist ein Stamm nicht vorhanden und wird manuell eingegeben, enthält das <code>[feldname-bezirk]</code>-Feld in der Mail folgende Warnung: <code>Achtung: Stamm selbst eingegeben!</code></p>
  <p>Prüfe dann, ob auf der Seite des Bundesverbands eine aktualisierte Liste der Gruppierungen zu finden ist, diese wird zweimal im Jahr nach den Beitragsabrechnungen aktualisiert :)</p>
  <br/>
  <p>Beispiele: <code>[stamm* stamm "Paderborn" "Bezirk Paderborn" "Paderborn, St. Meinolf"]</code>,</p>
  <p><code>[stamm abc "Münster"]</code>, <code>[stamm stamm2 "Erfurt" "" "Erfurt, St. Elisabeth"]</code>, <code>[stamm* stamm]</code></p>';
}

function cf7stammesauswahl_setting_groups() {
  $options = get_option( 'cf7stammesauswahl_plugin_options' );

  global $is_IE;
  if($is_IE) {
    wp_enqueue_script( 'cf7stammesauswahl-script',plugins_url( '/cf7stammesauswahl-es2015.js', __FILE__ ),[]);
    wp_enqueue_script( 'polyfills','/polyfill.min.js',[]);
  } else {
    wp_enqueue_script( 'cf7stammesauswahl-script',plugins_url( '/cf7stammesauswahl.js', __FILE__ ),[]);
    wp_enqueue_script( 'cf7stammesauswahl-admin-script',plugins_url( '/cf7stammesauswahl-admin.js', __FILE__ ),[]);
  }
 
    echo '<style>.cf7stammesauswahl label {width: 142px}</style>'.
      '<div class="cf7stammesauswahl" groups="'.esc_attr( $options['groups'] ).'">
        <label>Diözesanverband: <i class="dv-count"></i></label><span class="wpcf7-form-control-wrap"><select class="cf7stammesauswahl-dv wpcf7-form-control wpcf7-select"></select></span><br/>
        <label>Bezirk: <i class="bezirk-count"></i></label><span class="wpcf7-form-control-wrap"><select class="cf7stammesauswahl-bezirk wpcf7-form-control wpcf7-select"></select></span><br/>
        <label>Stamm: <i class="stamm-count"></label><span class="wpcf7-form-control-wrap">
            <select class="cf7stammesauswahl-stamm wpcf7-form-control wpcf7-select"></select>
          </span>
      </div>';
}

function cf7stammesauswahl_setting_paste() {
  echo '<p>Füge den Inhalt der <a target="_blank" href="https://dpsg.de/de/ueber-uns/satzung-ordnung-konzepte/ordnung-satzung.html">aktuellen Liste der Gruppierungen</a> in das Textfeld ein und klicke auf "Auslesen", um die Gruppierungen zu aktualisieren.</p>
  <i>1. Alles Markieren (Strg-A), 2. Kopieren (Strg-C), 3. Im Feld einfügen (Strg-V)</i>
  <p><b>Benutze dafür Chrome oder Firefox, nicht Internet Explorer!</b></p>
  <textarea id="cf7stammesauswahl-plugin-paste" style="width:400px;height:60px" disabled></textarea>
  <input id="cf7stammesauswahl-paste-button" class="button button-secondary" type="button" value="Auslesen" disabled/>';
}

function cf7stammesauswahl_setting_hidden() {
  $options = get_option( 'cf7stammesauswahl_plugin_options' );
  
  echo '<input id="cf7stammesauswahl_setting_hidden" name="cf7stammesauswahl_plugin_options[groups]" style="display:none" type="text" value="'.esc_attr( $options['groups'] ).'">';
}
