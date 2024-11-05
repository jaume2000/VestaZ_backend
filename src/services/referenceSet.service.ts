import Category from '../models/category.model';
import { Machine } from '../models/machine.model';
import Product from '../models/product.model';
import { ReferenceSet, IReferenceSet } from '../models/referenceSet.model';
import { Types } from 'mongoose';

interface CreateReferenceSetInput {
  references: string[];
  categories: string[];
  machines: string[];
  userId: Types.ObjectId;
}

export async function getReferences(): Promise<IReferenceSet[]> {
  const references = await ReferenceSet.find().populate('categories').populate('machines').exec();
  return references;
}

// FALTA AÑADIR AL HISTORIAL
export async function addReferenceManually(data: CreateReferenceSetInput) {
  const { references, categories, machines, userId } = data;

  //Validate that all the categories and machines exist. machines is an array of strings with the ids of the machines
  const categoriesExistPromise = Category.find({
    _id: { $in: categories }
  });

  const machinesExistPromise = Machine.find({
    _id: { $in: machines }
  });

  let categoriesExist: any;
  let machinesExist: any;
  try {
    [categoriesExist, machinesExist] = await Promise.all([categoriesExistPromise, machinesExistPromise]);
  }
  catch (error) {
    console.log(error)
    throw new Error('Some categories or machines do not exist');
  }

  if (categoriesExist.length > categories.length) {
    throw new Error('Some categories do not exist');
  }
  if (machinesExist.length > machines.length) {
    console.log(machinesExist.length, machines.length)
    console.log(categoriesExist.length, categories.length)
    throw new Error('Some machines do not exist');
  }

  //Search Sets with [...cross_references, reference] inside references
  const referenceSets = await ReferenceSet.find({
    references: { $in: references}
  });


  let referenceSet:IReferenceSet|null = null;

  //There is no set, create it
  if (referenceSets.length === 0) {
    try {

      const categoriesStringSet = [...new Set([...categories])];
      const machinesStringSet = [...new Set([...machines])];  
      
      referenceSet = await ReferenceSet.create({
        references: [...new Set(references)],
        categories: categoriesStringSet.map(c => new Types.ObjectId(c)),
        machines: machinesStringSet.map(c => new Types.ObjectId(c)),
      });
    }
    catch (error) {
      console.log(error)
      throw new Error('Error creating the reference set');
    }
  }
  else {
    //Only one Set, use it
    if (referenceSets.length === 1) {
      referenceSet = referenceSets[0];
    }
    //Many Sets, merge them
    else {
      referenceSet = referenceSets[0];
      const promises = []

      for (let i = 1; i < referenceSets.length; i++) {
        const otherSet = referenceSets[i];
        //Move info from other sets to the 1st.
        referenceSet.references = [...new Set([...referenceSet.references, ...otherSet.references])];
        referenceSet.categories = [...new Set([...referenceSet.categories, ...otherSet.categories])];
        referenceSet.machines = [...new Set([...referenceSet.machines, ...otherSet.machines])];

        //delete set
        promises.push(otherSet.deleteOne({
          _id: otherSet._id
        }));
      }

      await Promise.all([...promises])
    }

    //Add the reference to the set and the cross_references

    const categoriesStringSet = [...new Set([...referenceSet.categories.map(c => c.toString()), ...categories])];
    const machinesStringSet = [...new Set([...referenceSet.machines.map(c => c.toString()), ...machines])];

    referenceSet.references = [...new Set([...referenceSet.references, ...references])];
    referenceSet.categories = categoriesStringSet.map(c => new Types.ObjectId(c));
    referenceSet.machines = machinesStringSet.map(c => new Types.ObjectId(c));

    console.log(referenceSet.categories.map(c => c._id))
    console.log(categories)

    await referenceSet.save();
  }
}


interface CreateReferenceFromProductInput {
  product: Types.ObjectId;
  userId: Types.ObjectId;
}

/*
export async function addReferenceFromProduct(data: CreateReferenceFromProductInput) {
  const {product, userId} = data;

  //Search the product
  const productReference = await Product.findById(product);

  if (!productReference) {
    throw new Error('Product does not exist');
  }

  addReferenceManually({
    reference: productReference.sku,
    cross_references: productReference.cross_references,
    categories: productReference.category.map(c => c.toString()),
    machines: productReference.machines.map(c => c.toString()),
    userId
  });

}
  */