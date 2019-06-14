const fs = require('fs');

var page = require('webpage').create();
page.viewportSize = {
    width: 2048,
    height: 1152
};
page.onError = function (msg, trace) {
    console.error(msg);
};

page.open('https://www.nationalgeographic.com/photography/photo-of-the-day/_jcr_content/.gallery.json', function () {
    var result = JSON.parse(page.plainText);
    var galleryImage = result.items[0];

    var imageUrl = galleryImage.sizes[2048];
    var photoTitle = galleryImage.title;
    var photoText = galleryImage.caption;

    var template = fs.read('./template.html');
    template = template.replace('IMAGE_URL', imageUrl)
        .replace('PHOTO_TITLE', photoTitle)
        .replace('PHOTO_TEXT', photoText);
    fs.write('./template.out.html', template);
    page.setContent(template, imageUrl);
    page.onLoadFinished = function (status) {
        page.render('background.png');
        phantom.exit()
    };
});
