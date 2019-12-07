$(document).ready(function(){
    $('.delete-doc').on('click', function(e){
	$target = $(e.target);
	const id = $target.attr('data-id');
	$.ajax({
	    type: 'DELETE',
	    url: '/docs/'+id,
	    success: function(response){
		alert('Deleting Document');
		window.location.href='/docs/';
	    },
	    error: function(err){
		console.log(err);
	    }
	});
    });
});
