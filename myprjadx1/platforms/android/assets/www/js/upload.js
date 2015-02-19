/**
 * Helper class for resumable uploads using XHR/CORS. Can upload any Blob-like item, whether
 * files or in-memory constructs.
 *
 * @example
 * var content = new Blob(["Hello world"], {"type": "text/plain"});
 * var uploader = new MediaUploader({
 *   file: content,
 *   token: accessToken,
 *   onComplete: function(data) { ... }
 *   onError: function(data) { ... }
 * });
 * uploader.upload();
 *
 * @constructor
 * @param {object} options Hash of options
 * @param {string} options.token Access token
 * @param {blob} options.file Blob-like item to upload
 * @param {string} [options.fileId] ID of file if replacing
 * @param {object} [options.params] Additional query parameters
 * @param {string} [options.contentType] Content-type, if overriding the type of the blob.
 * @param {object} [options.metadata] File metadata
 * @param {function} [options.onComplete] Callback for when upload is complete
 * @param {function} [options.onError] Callback if upload fails
 */
var MediaUploader = function(options) {
  var noop = function() {};
  this.file = options.file;
  this.contentType = options.contentType || this.file.type || 'application/octet-stream';
  this.token = options.token;
  this.onComplete = options.onComplete || noop;
  this.onError = options.onError || noop;
 
  this.url = options.url;
  if (!this.url) {
    var params = options.params || {};
	
	if(options.uploadType == "simple")
	 {params.uploadType = 'media';}
	else if(options.uploadType == "multipart")
	 {params.uploadType = 'multipart';}
	
    this.url = this.buildUrl_(options.fileId, params);
  }
  this.httpMethod = this.fileId ? 'PUT' : 'POST';
    console.log("uploader constructor");
};


/**
 * Send the actual file content.
 *
 * @private
 */ 
MediaUploader.prototype.sendmedia = function() {
  
  var reader = new FileReader();
  reader.readAsArrayBuffer(this.file);
  //reader.readAsDataURL(this.file);
  reader.onload = this.sendonread.bind(this);
};


MediaUploader.prototype.sendonread = function(e) {

  var uploaddata = e.target.result;
  var xhr = new XMLHttpRequest();
  xhr.open('POST', this.url, true);
  xhr.setRequestHeader('Content-Type', "image/jpeg");
  //xhr.setRequestHeader('Content-Length', e.target.result.byteLength);
  console.log("URL for sending file"+this.url);
  //console.log("Auth token befor sending file"+this.token);
  //console.log("file size after FileReader" + e.target.result.byteLength);
  xhr.setRequestHeader('Authorization', 'Bearer ' + this.token);
  xhr.onload = this.onContentUploadSuccess_.bind(this);
  xhr.onerror = this.onContentUploadError_.bind(this);
  xhr.send(uploaddata);
};

/**
 * Send the actual file content.
 *
 * @private
 */ 
MediaUploader.prototype.sendmulti = function() {
  const boundary = '-------314159265358979323846';
  const delimiter = "\r\n--" + boundary + "\r\n";
  const close_delim = "\r\n--" + boundary + "--";
  var content = this.file;
  var reader = new FileReader();
  //reader.readAsArrayBuffer(content);
  reader.readAsDataURL(this.file);
  reader.onload = function(e) {
    var contentType = 'image/jpg';
    var metadata = {
      'title': this.file.name,
      'mimeType': contentType
    };
	
	var base64Data = e.target.result.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
	var multipartRequestBody =
        delimiter +
        'Content-Type: application/json\r\n\r\n' +
        JSON.stringify(metadata) +
        delimiter +
        'Content-Type: ' + contentType + '\r\n' +
        'Content-Transfer-Encoding: base64\r\n' +
        '\r\n' +
        base64Data +
        close_delim;
	console.log("upload multipart is:"+ multipartRequestBody);	
    var xhr = new XMLHttpRequest();
    xhr.open('POST', this.url, true);
    xhr.setRequestHeader('Authorization', 'Bearer ' + this.token);
    xhr.setRequestHeader('Content-Type', 'multipart/mixed; boundary="' + boundary + '"');
    console.log("The URL for sending file is:" + this.url);
    xhr.onload = this.onContentUploadSuccess_.bind(this);
    xhr.onerror = this.onContentUploadError_.bind(this);
    xhr.send(multipartRequestBody);
  }.bind(this);
  
};


/**
 * Handle successful responses for uploads. Depending on the context,
 * may continue with uploading the next chunk of the file or, if complete,
 * invokes the caller's callback.
 *
 * @private
 * @param {object} e XHR event
 */
MediaUploader.prototype.onContentUploadSuccess_ = function(e) {
  console.log("success status:" + e.target.status);
  console.log("success headers :" + e.target.getAllResponseHeaders());
  console.log("success response :" + e.target.response);
  if (e.target.status == 200 || e.target.status == 201) {
    this.onComplete(e.target.response);
  } else  {
    this.onError(e.target.response);
  }
};

/**
 * Handles errors for uploads. Either retries or aborts depending
 * on the error.
 *
 * @private
 * @param {object} e XHR event
 */
MediaUploader.prototype.onContentUploadError_ = function(e) {
   console.log("error response status:" + e.target.status);
   this.onError(e.target.response);
};


/**
* Construct a query string from a hash/object
*
* @private
* @param {object} [params] Key/value pairs for query string
* @return {string} query string
*/
MediaUploader.prototype.buildQuery_ = function(params) {
  params = params || {};
  return Object.keys(params).map(function(key) {
    return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
  }).join('&');
};

/**
* Build the drive upload URL
*
* @private
* @param {string} [id] File ID if replacing
* @param {object} [params] Query parameters
* @return {string} URL
*/
MediaUploader.prototype.buildUrl_ = function(id, params) {
  var url = 'https://www.googleapis.com/upload/drive/v2/files/';
  if (id) {
    url += id;
  }
  var query = this.buildQuery_(params);
  if (query) {
    url += '?' + query;
  }
  return url;
};



