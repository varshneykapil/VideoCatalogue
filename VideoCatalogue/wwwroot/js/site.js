function VideoCatalogueViewModel() {
	var self = this;
	self.InProgress = ko.observable(false);
	self.ShowUploadFormView = ko.observable(false);
	self.ShowCatalogueView = ko.observable(true);
	self.showUploadError = ko.observable(false);
	self.showLargeUploadError = ko.observable(false);
	self.Videos = ko.observableArray([]);

	self.DisplayUploadView = function () {
		self.ShowUploadFormView(true);
		self.ShowCatalogueView(false);
		self.showUploadError(false);
		self.showLargeUploadError(false);
	};

	self.DisplayCatalogueView = function () {
		self.ShowUploadFormView(false);
		self.ShowCatalogueView(true);
	};

	self.UploadVideos = function () {
		if ($("#file-videos").val() == "")
			return true;

		var form = $("#form-upload-videos");
		self.showUploadError(false);
		self.showLargeUploadError(false);
		self.InProgress(true);
		$.ajax({
			type: "POST",
			processData: false,
			contentType: false,
			cache: false,
			url: '../api/videos/upload',
			data: new FormData(form[0]),
			success: function (videos) {
				self.InProgress(false);
				self.Videos(videos);
				//self.LoadVideoCatalogue();
				self.DisplayCatalogueView();
			},
			error: function (xhr, status, p3, p4) {
				self.InProgress(false);
				self.showUploadError(true);
				if (xhr != undefined && xhr != null) {
					if (xhr.responseText.indexOf("Request body too large") > -1) {
						self.showUploadError(false);
						self.showLargeUploadError(true);
					}						
				}
			}
		});
	};

	self.ShowVideo = function (name) {
		var videoFile = "/media/" + name;
		var videoPlayer = $("#vpCatalogue")[0];
		videoPlayer.src = videoFile;
		videoPlayer.load();
		videoPlayer.play();
	}

	self.LoadVideoCatalogue = function () {
		$.getJSON("../api/videos", function (videos) {
			self.Videos(videos);
		});
	}

	self.init = function () {
		self.LoadVideoCatalogue();
	};

	self.init();
}

$(function () {
	var _vm = new VideoCatalogueViewModel();
	ko.applyBindings(_vm);
});