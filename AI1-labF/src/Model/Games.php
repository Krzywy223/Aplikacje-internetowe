<?php
namespace App\Model;

use App\Service\Config;

class Games
{
    private ?int $id = null;
    private ?string $title = null;
    private ?string $description = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(?int $id): Games
    {
        $this->id = $id;
        return $this;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(?string $title): Games
    {
        $this->title = $title;
        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): Games
    {
        $this->description = $description;
        return $this;
    }

    public static function fromArray($array): Games
    {
        $game = new self();
        $game->fill($array);
        return $game;
    }

    public function fill($array): Games
    {
        if (isset($array['id']) && !$this->getId()) {
            $this->setId($array['id']);
        }
        if (isset($array['title'])) {
            $this->setTitle($array['title']);
        }
        if (isset($array['description'])) {
            $this->setDescription($array['description']);
        }
        return $this;
    }

    public static function findAll(): array
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM games';
        $statement = $pdo->prepare($sql);
        $statement->execute();

        $games = [];
        $gamesArray = $statement->fetchAll(\PDO::FETCH_ASSOC);
        foreach ($gamesArray as $gameArray) {
            $games[] = self::fromArray($gameArray);
        }
        return $games;
    }

    public static function find($id): ?Games
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM games WHERE id = :id';
        $statement = $pdo->prepare($sql);
        $statement->execute(['id' => $id]);

        $gameArray = $statement->fetch(\PDO::FETCH_ASSOC);
        if (!$gameArray) {
            return null;
        }
        $game = Games::fromArray($gameArray);
        return $game;
    }

    public function save(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        if (!$this->getId()) {
            $sql = "INSERT INTO games (title, description) VALUES (:title, :description)";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                'title' => $this->getTitle(),
                'description' => $this->getDescription(),
            ]);
            $this->setId($pdo->lastInsertId());
        } else {
            $sql = "UPDATE games SET title = :title, description = :description WHERE id = :id";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                ':title' => $this->getTitle(),
                ':description' => $this->getDescription(),
                ':id' => $this->getId(),
            ]);
        }
    }

    public function delete(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = "DELETE FROM games WHERE id = :id";
        $statement = $pdo->prepare($sql);
        $statement->execute([':id' => $this->getId()]);

        $this->setId(null);
        $this->setTitle(null);
        $this->setDescription(null);
    }
}