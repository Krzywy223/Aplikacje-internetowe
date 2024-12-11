<?php
/** @var \App\Model\Games $game */
/** @var \App\Service\Router $router */

$title = 'Create Game';
$bodyClass = 'create';

ob_start(); ?>
    <h1>Create Game</h1>
    <form action="<?= $router->generatePath('game-create') ?>" method="post">
        <label for="title">Title</label>
        <input type="text" id="title" name="game[title]" value="<?= htmlspecialchars($game->getTitle() ?? '', ENT_QUOTES, 'UTF-8') ?>" required>
        <br>
        <label for="description">Description</label>
        <textarea id="description" name="game[description]" required><?= htmlspecialchars($game->getDescription() ?? '', ENT_QUOTES, 'UTF-8') ?></textarea>
        <br>
        <button type="submit">Create</button>
    </form>
    <a href="<?= $router->generatePath('game-index') ?>">Back to list</a>

<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';