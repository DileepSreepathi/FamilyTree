using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using System.IO;
using System.Text.Json;
using System.Threading.Tasks;
using FamilyTree.Api.Models;

namespace FamilyTree.Api
{
    public class SaveTree
    {
        private readonly ILogger<SaveTree> _logger;

        public SaveTree(ILogger<SaveTree> logger)
        {
            _logger = logger;
        }

        [Function("SaveTree")]
        [CosmosDBOutput(
            databaseName: "FamilyTreeDb",
            containerName: "Trees",
            Connection = "CosmosDbConnection",
            CreateIfNotExists = true,
            PartitionKey = "/id")]
        public async Task<object> Run(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = "tree")] HttpRequest req)
        {
            _logger.LogInformation("C# HTTP trigger function processed a request.");

            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            var data = JsonSerializer.Deserialize<TreeData>(requestBody);

            return data;
        }
    }
}
