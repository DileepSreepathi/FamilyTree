using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace FamilyTree.Api
{
    public class GetTree
    {
        private readonly ILogger<GetTree> _logger;

        public GetTree(ILogger<GetTree> logger)
        {
            _logger = logger;
        }

        [Function("GetTree")]
        public IActionResult Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "tree/{userId}")] HttpRequest req,
            [CosmosDBInput(
                databaseName: "FamilyTreeDb",
                containerName: "Trees",
                Connection = "CosmosDbConnection",
                Id = "{userId}",
                PartitionKey = "{userId}")] object? treeData)
        {
            _logger.LogInformation("C# HTTP trigger function processed a request.");

            if (treeData == null)
            {
                return new NotFoundResult();
            }

            return new OkObjectResult(treeData);
        }
    }
}
