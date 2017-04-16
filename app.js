'use strict';

// Add Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js', { scope: './' }).then(function(reg) {

    if (reg.installing) {
      console.log('Service worker installing');
    } else if (reg.waiting) {
      console.log('Service worker installed');
    } else if (reg.active) {
      console.log('Service worker active');
    }

  }).catch(function(error) {
    // registration failed
    console.log('Registration failed with ' + error);
  });
}

$(document).ready(function() {

  // Apply Modal
  $('.modal').modal();

  // Instantiate the Cloudinary jQuery module
  var cl = cloudinary.CloudinaryJQuery.new( { cloud_name: "elsmore-me"});

  // Apply the Cloudinary logo to the header
  var cloudinaryLogo = cl.imageTag("cloudinary_logo");
  cloudinaryLogo.transformation().width(200);
  $('nav #nav-logo').html(cloudinaryLogo.toHtml());

  // View the photo
  function viewPhoto() {
    var publicId = $(this).attr('public-id');
    var imageName = $(this).attr('image-name');

    var tr = cloudinary.Transformation.new();
    tr.overlay('cloudinary_logo').width('500').x('10').y('10').opacity('70').gravity('south_east');
    var imageUrlOriginal = cl.url(publicId, tr);
    tr.chain().crop('fit').width('800');
    var imageUrl = cl.url(publicId, tr);

    $('#person-view').html('<photo-view image-url="'+imageUrl+'" image-url-original="'+imageUrlOriginal+'" image-name="'+imageName+'"></photo-view>');
    $('.modal').modal('open');
  };

  // List out the images
  var tr = cloudinary.Transformation.new();
  tr.crop('thumb').gravity('face').height('500').width('500').chain()
    .crop('fill').height('150').width('300').chain()
    .overlay('cloudinary_logo').gravity('south_east').width('100').opacity('70').x('10').y('10');
  $.get('./images.json', function(result, error) {
    $('#person-list').html('');
    result.forEach(function(value) {
      var personThumbImage = cl.url(value.publicId, tr);
      $('#person-list').append('<div class="col l3 m4 s12"><photo-thumb id="'+value.publicId+'" public-id="'+value.publicId+'" image-url="'+personThumbImage+'" image-name="'+value.name+'"></photo-thumb></div>');

      var photoThumb = document.querySelector('#'+value.publicId);
      photoThumb.addEventListener('btn-clicked', viewPhoto);
    });
  });
});
