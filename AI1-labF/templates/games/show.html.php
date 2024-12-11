<?php
/** @var \App\Model\Games $game */
/** @var \App\Service\Router $router */

$title = 'Game Details';
$bodyClass = 'show';

ob_start(); ?>
    <h1>Game Details</h1>
    <p><strong>Title:</strong> <?= htmlspecialchars($game->getTitle(), ENT_QUOTES, 'UTF-8') ?></p>
    <p><strong>Description:</strong> <?= htmlspecialchars($game->getDescription(), ENT_QUOTES, 'UTF-8') ?></p>
    <a href="<?= $router->generatePath('game-edit', ['id' => $game->getId()]) ?>">Edit</a>
    <a href="<?= $router->generatePath('game-index') ?>">Back to list</a>

<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';