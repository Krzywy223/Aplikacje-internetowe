<?php
    /** @var $games ?\App\Model\Games */
?>

<div class="form-group">
    <label for="subject">Subject</label>
    <input type="text" id="subject" name="post[subject]" value="<?= $games ? $games->getSubject() : '' ?>">
</div>

<div class="form-group">
    <label for="content">Content</label>
    <textarea id="content" name="post[content]"><?= $games? $games->getContent() : '' ?></textarea>
</div>

<div class="form-group">
    <label></label>
    <input type="submit" value="Submit">
</div>
