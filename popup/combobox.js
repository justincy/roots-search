(function( $ ) {
  
  $.widget( "ui.combobox", {
    
    options: {
      values: []
    },
  
    _create: function() {
      var input,
        self = this,
        select = this.element.hide();
      
      // If the value are set, add them to the select
      if( self.options.values.length > 0 ) {
        select.html('');
        $.each(self.options.values,function(i,v){
          select.append('<option>'+v+'</option>');
        });
      } 
      // Otherwise, populate the values array with the children
      else if( select.children().length > 0 ) {
        console.log(select.options.values);
        select.options.values = [];
        select.children.each(function(){
          self.options.values.push($(this).val());
        });
      }
        
      var selected = select.children( ":selected" ),
        value = selected.val() ? selected.text() : "",
        wrapper = this.wrapper = $( "<span>" )
          .addClass( "ui-combobox" )
          .insertAfter( select );      
          
      input = $( "<input>" )
        .appendTo( wrapper )
        .val( value )
        .addClass( "ui-state-default ui-combobox-input" )
        .autocomplete({
          delay: 0,
          minLength: 0,
          source: self.options.values,
          select: function( event, ui ) {
            ui.item.option.selected = true;
            self._trigger( "selected", event, {
              item: ui.item.option
            });
          },
          change: function( event, ui ) {
            if ( !ui.item ) {
              var matcher = new RegExp( "^" + $.ui.autocomplete.escapeRegex( $(this).val() ) + "$", "i" ),
                valid = false;
              select.children( "option" ).each(function() {
                if ( $( this ).text().match( matcher ) ) {
                  this.selected = valid = true;
                  return false;
                }
              });
              if ( !valid ) {
                // Add the new value to the list of values
                select.prepend('<option>'+$(this).val()+'</option>');
                select.val( $(this).val() );
              }
            }
          }
        })
        .addClass( "ui-widget ui-widget-content ui-corner-left" );

      input.data( "autocomplete" )._renderItem = function( ul, item ) {
        return $( "<li></li>" )
          .data( "item.autocomplete", item )
          .append( "<a>" + item.label + "</a>" )
          .appendTo( ul );
      };

      $( "<a>" )
        .attr( "tabIndex", -1 )
        .attr( "title", "Show All Items" )
        .appendTo( wrapper )
        .button({
          icons: {
            primary: "ui-icon-triangle-1-s"
          },
          text: false
        })
        .removeClass( "ui-corner-all" )
        .addClass( "ui-corner-right ui-combobox-toggle" )
        .click(function() {
          // close if already visible
          if ( input.autocomplete( "widget" ).is( ":visible" ) ) {
            input.autocomplete( "close" );
            return;
          }

          // work around a bug (likely same cause as #5265)
          $( this ).blur();

          // pass empty string as value to search for, displaying all results
          input.autocomplete( "search", "" );
          input.focus();
        });
    },

    destroy: function() {
      this.wrapper.remove();
      this.element.show();
      $.Widget.prototype.destroy.call( this );
    }
  });
})( jQuery );