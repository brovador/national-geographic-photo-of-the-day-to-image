const url = 'https://www.nationalgeographic.com/photography/photo-of-the-day/'
const fs = require('fs')

var page = require('webpage').create()
page.viewportSize = { width: 1920, height: 1080 }
page.onError = function(msg, trace) {}
page.open(url, function() {
    setTimeout(function() {
		var imageUrl = page.evaluate(function(){
			var images = document.getElementsByTagName("source")[0].getAttribute("srcset").split(" ")
			return images[images.length - 2]
		})
		var photoTitle = page.evaluate(function(){
			return document.getElementsByClassName("media__caption--title")[0].textContent
		})
		var photoText = page.evaluate(function(){
			return document.getElementsByTagName("p")[0].textContent
		})
		
		if (!imageUrl) {
			phantom.exit()
		} else {
			var template = fs.read('./template.html')
			template = template.replace('IMAGE_URL', imageUrl)
				.replace('PHOTO_TITLE', photoTitle)
				.replace('PHOTO_TEXT', photoText)
			fs.write('./template.out.html', template)
			page.viewportSize = { width: 1920, height: 1080 }
			page.setContent(template, url)
			page.onLoadFinished = function(status){
				page.render('background.png')
				phantom.exit()
			}
		}

    }, 500);
});