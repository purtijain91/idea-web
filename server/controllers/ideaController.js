const Idea = require("../models/Idea");

// create an idea
exports.createIdea = async (req, res) => {
  try {
    console.log("🟢 createIdea called");

    const { title, description } = req.body;
    console.log("📩 Request Body:", { title, description });

    const images = [];
    const videos = [];

    if (req.files) {
      console.log("📂 Files received:", req.files.length);
      req.files.forEach((file) => {
        console.log(
          "📄 Processing file:",
          file.originalname,
          "👉",
          file.mimetype
        );

        if (file.mimetype.startsWith("image")) {
          images.push(`/uploads/${file.filename}`);
          console.log("🖼️ Image saved:", `/uploads/${file.filename}`);
        } else if (file.mimetype.startsWith("video")) {
          videos.push(`/uploads/${file.filename}`);
          console.log("🎬 Video saved:", `/uploads/${file.filename}`);
        }
      });
    } else {
      console.log("⚠️ No files found in request");
    }

    const idea = await Idea.create({
      title,
      description,
      images,
      videos,
      user: req.user,
    });

    console.log("✅ Idea created successfully:", idea._id);

    res.json({ idea });
  } catch (error) {
    console.error("❌ Error creating idea:", error.message);
    res.status(500).json({ error: "Failed to create idea" });
  }
};

// get all ideas
exports.getIdeas = async (req, res) => {
  try {
    const ideas = await Idea.find()
      .populate("user", "email")
      .populate("comments.user", "email")
      .sort({ createdAt: -1 });
    res.json({ ideas });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch ideas" });
  }
};

//like and unlike an idea
exports.toggleLike = async (req, res) => {
  try {
    console.log("🔄 Toggle Like API called");

    // Step 1: Find idea
    console.log("📌 Idea ID from params:", req.params.id);
    const idea = await Idea.findById(req.params.id);

    if (!idea) {
      console.log("❌ Idea not found");
      return res.status(404).json({ error: "Idea not found" });
    }

    // Step 2: Get user
    const userId = req.user;
    console.log("👤 Logged-in User ID:", userId);

    // Step 3: Check like/unlike
    if (idea.likes.includes(userId)) {
      console.log("👎 User already liked → Removing like");
      idea.likes.pull(userId); // unlike
    } else {
      console.log("👍 User not liked yet → Adding like");
      idea.likes.push(userId); // like
    }

    // Step 4: Save idea
    await idea.save();
    console.log("💾 Idea saved with new likes:", idea.likes);

    // Step 5: Response
    res.json(idea);
    console.log("✅ Response sent → Total likes:", idea.likes.length);
  } catch (error) {
    console.error("🔥 Error in toggleLike:", error.message);
    res.status(500).json({ error: "Failed to toggle like" });
  }
};


//  Add comment
exports.addComment = async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) return res.status(404).json({ error: "Idea not found" });

    const newComment = {
      user: req.user,
      text: req.body.text,
    };

    idea.comments.push(newComment);
    await idea.save();

    res.json(idea.comments);
  } catch (error) {
    res.status(500).json({ error: "Failed to add comment" });
  }
};

// Update idea (only author)
exports.updateIdea = async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) return res.status(404).json({ error: "Idea not found" });

    if (idea.user.toString() !== req.user) {
      return res.status(403).json({ error: "Not authorized" });
    }

    idea.title = req.body.title || idea.title;
    idea.description = req.body.description || idea.description;
    idea.images = req.body.images || idea.images;
    idea.videos = req.body.videos || idea.videos;

    await idea.save();
    res.json(idea);
  } catch (error) {
    res.status(500).json({ error: "Failed to update idea" });
  }
};

// Delete idea (only author)
exports.deleteIdea = async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) return res.status(404).json({ error: "Idea not found" });

    if (idea.user.toString() !== req.user) {
      return res.status(403).json({ error: "Not authorized" });
    }

    await idea.remove();
    res.json({ message: "Idea deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete idea" });
  }
};

