using System.Text.Json.Serialization;

namespace FamilyTree.Api.Models
{
    public class TreeData
    {
        [JsonPropertyName("id")]
        public string Id { get; set; } // UserId

        [JsonPropertyName("nodes")]
        public object[] Nodes { get; set; }

        [JsonPropertyName("edges")]
        public object[] Edges { get; set; }
    }
}
