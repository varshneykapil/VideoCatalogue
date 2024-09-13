using Microsoft.AspNetCore.Mvc;
using System.IO;
using VideoCatalogue.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace VideoCatalogue.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VideosController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            var videos = GetVideos();
            return Ok(videos);
        }


        [HttpPost("upload")]
        [RequestSizeLimit(209715200)]
        public async Task<IActionResult> UploadVideos(IFormFile[] videos)
        {
            if (videos == null || videos.Count() == 0)
                return BadRequest("No video uploaded.");
            try
            {
                Directory.CreateDirectory(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/media"));
                foreach (var video in videos)
                {
                    var path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/media", video.FileName);
                    using (var stream = new FileStream(path, FileMode.Create))
                    {
                        await video.CopyToAsync(stream);
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error.");
            }
            return Ok(GetVideos());
        }

        private List<Media> GetVideos()
        {
            var videos = new List<Media>();
            var directoryPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/media");
            if (Directory.Exists(directoryPath))
            {
                foreach (var file in Directory.GetFiles(directoryPath))
                {
                    var fileInfo = new FileInfo(file);
                    var size = Convert.ToInt32(fileInfo.Length / 1024);
                    videos.Add(new Media { Name = fileInfo.Name, Size = size });
                }
            }
            return videos;
        }
    }
}
