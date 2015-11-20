jQuery(document).ready(function($)
{	
	var list 		= $('body.sortable-posts .wp-list-table #the-list'),
		rows		= list.find('tr'),
		statusBox	= $( '#sortable-posts-status' ),
		statusHead	= statusBox.find( '#sortable-posts-status-head' ),
		statusMsg	= statusBox.find( '#sortable-posts-status-message' );

	// Make list sortable.
	list.sortable({
		handle: '.column-sortable-posts-order',
		placeholder: 'sortable-posts-placeholder',
		helper: function( e, ui ) {
			ui.children().each(function() {
				$(this).width( $(this).width() );
			});
			return ui;
		},
		forcePlaceholderSize: true,
		forceHelperSize: true,
		start: function(e, ui ) {
			ui.placeholder.height(ui.helper.outerHeight());
		},
	});

	// Update order.
	list.on( 'sortupdate', function( event, ui )
	{
		var order = $(this).sortable( 'toArray' );

		$.ajax({
			type: 'post',
			url: WP_API_Settings.root + 'sortable-posts/update',
			beforeSend: function ( xhr ) {
				xhr.setRequestHeader( 'X-WP-Nonce', WP_API_Settings.nonce );
			},
			data: {
				order: order,
				start: WP_API_Settings.start,
			}
		}).done( function( response ) {

			// Update position in the row.
			rows.each( function()
			{
				var id = $(this).attr('id'),
					index = $(this).index( '#' . id ),
					numberContainer = $(this).find('.sortable-posts-order-position');

				numberContainer.html( (WP_API_Settings.start * 1) + index );
			});

			statusBox.addClass( 'updated sp-visible animated fadeInUp' );

		}).fail( function( response ) {

			statusBox.addClass( 'error sp-visible animated fadeInUp' );
			
		}).always( function( response ) {

			statusMsg.html( response );

			// Remove classes and fade out
			setTimeout(function() {
				statusBox.removeClass( 'fadeInUp' ).addClass( 'fadeOutDown' );
			}, 4000 );

			// Remove all classes and hide the status box
			setTimeout(function() {
				statusBox.removeClass();
			}, 4800 );
		
		});
		
	});

});