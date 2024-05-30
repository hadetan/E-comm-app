import Collection from "../models/collection.schema.js";
import asyncHandler from "../utils/asynchHandler.js";
import customError from "../utils/customError.js";

/** 
 * @CREATE_COLLECTION
 * @route http://localhost:5000/api/collection/
 * @description Creating Collection category
 * @returns Created Collection Object
*/

export const createCollection = asyncHandler( async(req, res) => {
    const {name} = req.body;

    if (!name) {
        throw new customError("Collection name is required", 400);
    }

    const collection = await Collection.create({
        name
    });

    res.status(200).json({
        success: true,
        message: "Collection name is added successfully",
        collection
    })
});

/** 
 * @UPDATE_COLLECTION
 * @route http://localhost:5000/api/collection/:id
 * @description Updating Collection category
 * @returns Updated Collection Object
*/

export const updateCollection = asyncHandler( async(req, res) => {
    const {name} = req.body;
    const {id: collectionId} = req.params;

    if (!name) {
        throw new customError("Collection name required before updating", 400);
    }

    let updatedCollection = await Collection.findByIdAndUpdate(collectionId, {
        name
    }, {
        new: true,
        runValidators: true
    });

    if (!updateCollection) {
        throw new customError("Collection not found to update", 404);
    }

    res.status(200).json({
        success: true,
        message: "Collection updated successfully",
        updatedCollection
    })
});

/** 
 * @DELETE_COLLECTION
 * @route http://localhost:5000/api/collection/:id
 * @description Deleting Collection category
 * @returns Delete Message
*/

export const deleteCollection = asyncHandler( async(res, req) => {
    const {id: collectionId} = req.params;

    const deletedCollection = await Collection.findById(collectionId);

    if (!deleteCollection) {
        throw new customError("Collection not found to delete", 404);
    }

    await deletedCollection.remove();

    res.status(200).json({
        success: true,
        message: "Collection deleted successfully"
    })
});

/** 
 * @GETTING_ALL_COLLECTIONS
 * @route http://localhost:5000/api/collection/
 * @description Getting All Collections category
 * @returns Collections Object
*/

export const getAllCollections = asyncHandler( async(_, res) => {
    const collections = await Collection.find();

    if (!collections) {
        throw new customError("No collection found", 404);
    }

    res.status(200).json({
        success: true,
        collections
    })
});