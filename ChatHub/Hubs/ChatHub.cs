using Microsoft.AspNetCore.SignalR;

namespace ChatHub.Hubs
{
    public class ChatHub : Hub
    {

        public async Task AddToGroupAsync(string group)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, group);
        }

        public async Task RemoveFromGroupAsync(string group)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, group);
        }

        public async Task SendMessage(string user, string message, string group)
        {
            await Clients.Group(group).SendAsync("ReceiveMessage", user, message);
        }


    }
}
