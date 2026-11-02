const db = require("../models");
const Place = db.places;
const Category = db.categories;
const Floor = db.floors;
const Direction = db.directions;
const Op = db.Sequelize.Op;

// Create and Save a new Place with 3NF relations and directions
exports.create = async (req, res) => {
  if (!req.body.name || !req.body.place_key) {
    return res.status(400).send({
      message: "Place name and key cannot be empty!"
    });
  }

  try {
    // 1. Create the main place record
    const place = await Place.create({
      place_key: req.body.place_key,
      name: req.body.name,
      map_label: req.body.map_label,
      description: req.body.description,
      category_id: req.body.category_id,
      floor_id: req.body.floor_id
    });

    // 2. If directions array is provided, insert step-by-step instructions
    if (req.body.directions && Array.isArray(req.body.directions)) {
      for (let i = 0; i < req.body.directions.length; i++) {
        await Direction.create({
          place_id: place.place_id,
          step_order: i + 1,
          direction_text: req.body.directions[i]
        });
      }
    }

    res.send(place);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while creating the place."
    });
  }
};

// Retrieve all Places from the database with categories, floors, and directions included
exports.findAll = async (req, res) => {
  const name = req.query.name;
  var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

  try {
    const data = await Place.findAll({
      where: condition,
      include: [
        { model: Category, attributes: ['category_name'] },
        { model: Floor, attributes: ['floor_name'] },
        { model: Direction, attributes: ['step_order', 'direction_text'] }
      ]
    });
    res.send(data);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving places."
    });
  }
};

// Find a single Place with an id, including 3NF relations
exports.findOne = async (req, res) => {
  const id = req.params.id;

  try {
    const data = await Place.findByPk(id, {
      include: [
        { model: Category, attributes: ['category_name'] },
        { model: Floor, attributes: ['floor_name'] },
        { model: Direction, attributes: ['step_order', 'direction_text'] }
      ]
    });

    if (data) {
      res.send(data);
    } else {
      res.status(404).send({
        message: `Cannot find Place with id=${id}.`
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "Error retrieving Place with id=" + id
    });
  }
};

// Update a Place by the id in the request (and refresh directions if provided)
exports.update = async (req, res) => {
  const id = req.params.id;

  try {
    const [num] = await Place.update(req.body, {
      where: { place_id: id }
    });

    if (num === 1) {
      // If new directions are provided, clear old ones and re-insert
      if (req.body.directions && Array.isArray(req.body.directions)) {
        await Direction.destroy({ where: { place_id: id } });
        for (let i = 0; i < req.body.directions.length; i++) {
          await Direction.create({
            place_id: id,
            step_order: i + 1,
            direction_text: req.body.directions[i]
          });
        }
      }

      res.send({
        message: "Place was updated successfully."
      });
    } else {
      res.send({
        message: `Cannot update Place with id=${id}. Maybe Place was not found or req.body is empty!`
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "Error updating Place with id=" + id
    });
  }
};

// Delete a Place with the specified id in the request
exports.delete = async (req, res) => {
  const id = req.params.id;

  try {
    const num = await Place.destroy({
      where: { place_id: id }
    });

    if (num === 1) {
      res.send({
        message: "Place was deleted successfully!"
      });
    } else {
      res.send({
        message: `Cannot delete Place with id=${id}. Maybe Place was not found!`
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "Could not delete Place with id=" + id
    });
  }
};

// Delete all Places from the database.
exports.deleteAll = async (req, res) => {
  try {
    const nums = await Place.destroy({
      where: {},
      truncate: false
    });
    res.send({ message: `${nums} Places were deleted successfully!` });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while removing all places."
    });
  }
};
