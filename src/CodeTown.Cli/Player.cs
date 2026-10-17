namespace CodeTown.Cli;

public class Player
{
    public void Move()
    {
        Console.WriteLine("Oyuncu hareket etti.");
    }

    public void Heal()
    {
        Console.WriteLine("Oyuncu iyileşti.");
    }

    public void Jump()
    {
        Console.WriteLine("Oyuncu zıpladı.");
    }

    public bool CanEnter(int level, int coins, bool isBanned)
    {
        if (isBanned || level < 1 || level > 100
            || coins < 10 || coins > 10000)
        {
            return false;
        }

        return true;
    }
}