import { Brand, IBrand } from '../models/brand.model';
import Category, { ICategory } from '../models/category.model';
import { Machine } from '../models/machine.model';
import Product from '../models/product.model';
import { ReferenceSet, IReferenceSet, IReferenceSetPopulated } from '../models/referenceSet.model';
import { Types } from 'mongoose';
import { InputData, UserDataInput } from '../types/dataInput';

interface CreateReferenceSetInput extends InputData{
  references: {reference: string, brand: Types.ObjectId}[];
  categories: Types.ObjectId[];
  machines: Types.ObjectId[];
  weight?: number;
  description?: string;
}

interface CreateReferenceSetInputData extends UserDataInput {
  data: CreateReferenceSetInput;
}

export async function getReferences(): Promise<IReferenceSet[]> {
  const references = await ReferenceSet.find().populate('categories').populate('machines').populate('references.brand').exec();
  return references;
}

export async function addReferenceManually(input: CreateReferenceSetInputData) {
  const { data, userId } = input;
  const { references, categories, machines, description, weight } = data;

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
    //console.log(machinesExist.length, machines.length)
    //console.log(categoriesExist.length, categories.length)
    throw new Error('Some machines do not exist');
  }

  
  //Matching algorithm


  const referenceSets = await ReferenceSet.find({
    references: {
      $elemMatch: {
        $or: references.map(ref => ({
          reference: ref.reference,
          brand: ref.brand
        }))
      }
    }
  });
  

  //console.log("Found sets:",referenceSets)


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
        description,
        weight,
        createdBy: userId
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
        referenceSet.references = [
          ...new Map(
            [...referenceSet.references, ...otherSet.references].map(ref => [
              `${ref.reference}-${(ref.brand as Types.ObjectId).toString()}`, // Crea un key único
              ref
            ])
          ).values()
        ];
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

    referenceSet.references = [
      ...new Map(
        [...referenceSet.references, ...references].map(ref => [
          `${ref.reference}-${ref.brand.toString()}`, // Crea un key único
          ref
        ])
      ).values()
    ];
    referenceSet.categories = categoriesStringSet.map(c => new Types.ObjectId(c));
    referenceSet.machines = machinesStringSet.map(c => new Types.ObjectId(c));

    //Overwrite the description and weight
    if (description) {
      referenceSet.description = description;
    }
    if (weight) {
      referenceSet.weight = weight;
    }

    //console.log(referenceSet.categories.map(c => c._id))
    //console.log(categories)

    await referenceSet.save();
  }
}





export async function simulateAddReferenceManuallyService(input: CreateReferenceSetInputData) {
  const { references, categories, machines, description, weight } = input.data
  const userId = input.userId;


  const categoriesStringSet = [...new Set([...categories])];
  const machinesStringSet = [...new Set([...machines])];
  const referencesStringSet = [...new Map(references.map(ref => [`${ref.reference}-${ref.brand.toString()}`, ref])).values()];

  
  //Validate that all the categories and machines exist. machines is an array of strings with the ids of the machines
  const categoriesExistPromise = Category.find({
    _id: { $in: categoriesStringSet }
  });

  const machinesExistPromise = Machine.find({
    _id: { $in: machinesStringSet }
  });

  const brandsExistPromise = Brand.find({
    _id: { $in: referencesStringSet.map(ref => ref.brand) }
  });


  let [categoriesExist, machinesExist, brandsExist] = await Promise.all([categoriesExistPromise, machinesExistPromise, brandsExistPromise]);
  
  const brandsExistDict = brandsExist.reduce<Record<string, IBrand>>((acc, brand) => {
    acc[(brand._id as Types.ObjectId).toString()] = brand;
    return acc;
  }, {});

  if (categoriesExist.length > categoriesStringSet.length) {
    throw new Error('Some categories do not exist');
  }
  if (machinesExist.length > machinesStringSet.length) {
    throw new Error('Some machines do not exist');
  }
  if (brandsExist.length > referencesStringSet.length) {
    throw new Error('Some brands do not exist');
  }

  const referencesExist = referencesStringSet.map((ref,i) => {
    return {
      reference: ref.reference,
      brand: brandsExistDict[ref.brand.toString()]
    }
  })

  //console.log("References exist:", referencesExist)

  const newSet = {
    references: referencesExist,
    categories: categoriesExist,
    machines: machinesExist,
    description,
    weight,
    createdBy: userId
  };
  
  //Matching algorithm

  const matchingSets = await ReferenceSet.find({
    references: {
      $elemMatch: {
        $or: references.map(ref => ({
          reference: ref.reference,
          brand: ref.brand
        }))
      }
    }
  }).populate('categories')
  .populate('machines')
  .populate('references.brand')
  .lean<IReferenceSetPopulated[]>()
  .exec();

  const before: IReferenceSetPopulated[] = matchingSets.map(set => Object.assign({}, set));

  let referenceSet:IReferenceSetPopulated|null = null;

  
  
  // Merging algorithm

  if (matchingSets.length === 0) {
    //No set, create it
    return {newSet, before: [], after: newSet};
  }
  else if (matchingSets.length === 1) {
    //Only one Set, use it and then merge the new one
    referenceSet = matchingSets[0]
  }
  else {
    //Many Sets, merge them and then use it to mergit with the new one.
    //Why? New reference set connects with several unconnected sets. We have B and C. But now we know A = B and A = B, then B = C. We are doing B = C before adding A.
    
    referenceSet = matchingSets[0]

    for (let i = 1; i < matchingSets.length; i++) {
      const otherSet = matchingSets[i];
      //Move info from other sets to the 1st.
      referenceSet.references = [
        ...new Map(
          [...referenceSet.references, ...otherSet.references].map(ref => [
            `${ref.reference}-${ref.brand.toString()}`, // Crea un key único
            ref
          ])
        ).values()
      ];
      referenceSet.categories = [
        ...new Map(
          [...referenceSet.categories, ...otherSet.categories].map(c => [
            c._id.toString(),
            c
          ])
        ).values()
      ]
      referenceSet.machines = [
        ...new Map(
          [...referenceSet.machines, ...otherSet.machines].map(m => [
            m._id.toString(),
            m
          ])
        ).values()
      ]

    }
  }

  //Last step, merge the new reference set to the found one (or group of sets that we merged into one).

  referenceSet.categories = [
    ...new Map(
      [...referenceSet.categories, ...categoriesExist].map(c => [
        c._id.toString(),
        c
      ])
    ).values()
  ]
  referenceSet.references = [
    ...new Map(
      [...referenceSet.references, ...referencesExist].map(ref => {
        return [
        `${ref.reference}-${ref.brand._id}`, // Crea un key único
        ref
      ]})
    ).values()
  ];

  //Overwrite the description and weight
  if (description) {
    referenceSet.description = description;
  }
  if (weight) {
    referenceSet.weight = weight;
  }

  return {newSet, before, after: referenceSet};

}

interface CreateReferencesFromExcelInputData extends UserDataInput {
  data: CreateReferenceSetInput[];
}

/**
 * Given a list of sets, it merges them into one. It doesn't match between the sets, it just merges them.
 * @param sets 
 * @returns 
 */
function unifyReferenceSets(sets: IReferenceSetPopulated[]): IReferenceSetPopulated {
  const referenceSet = sets[0];
  for (let i = 1; i < sets.length; i++) {
    const otherSet = sets[i];
    //Move info from other sets to the 1st.
    referenceSet.references = [
      ...new Map(
        [...referenceSet.references, ...otherSet.references].map(ref => [
          `${ref.reference}-${ref.brand.toString()}`, // Crea un key único
          ref
        ])
      ).values()
    ];
    referenceSet.categories = [
      ...new Map(
        [...referenceSet.categories, ...otherSet.categories].map(c => [
          c._id.toString(),
          c
        ])
      ).values()
    ]
    referenceSet.machines = [
      ...new Map(
        [...referenceSet.machines, ...otherSet.machines].map(m => [
          m._id.toString(),
          m
        ])
      ).values()
    ]

  }
  return referenceSet;
}

/**
 * Given a referenceSet and another referenceSet, it returns true if they match, false otherwise.
 * @param referenceSet 
 * @param otherSet 
 */
function matchTwoReferenceSets(referenceSet: IReferenceSetPopulated, otherSet: IReferenceSetPopulated): boolean {
  referenceSet.references.forEach(ref => {
    if (!otherSet.references.find(r => r.reference === ref.reference && r.brand._id.toString() === ref.brand._id.toString())) {
      return false;
    }
  });
  return true;

}

/**
 * Given a referenceSet and a list of referenceSets, it matches the referenceSet into the list of referenceSets and returns the index of the matched set.
 * Returns -1 if it doesn't match.
 * @param referenceSet 
 * @param sets 
 */
function matchReferenceSetIntoListOfSets(referenceSet: IReferenceSetPopulated, sets: IReferenceSetPopulated[]): number {
  for (let i = 0; i < sets.length; i++) {
    if (matchTwoReferenceSets(referenceSet, sets[i])) {
      return i;
    }
  }
  return -1;
}

/**
 * Given a list of sets, it matches the sets that have the same references and merges them into one.
 * @param sets 
 */
function matchAndMergeListOfReferenceSets(sets: IReferenceSetPopulated[]): IReferenceSetPopulated[] {
  const mergedSets: IReferenceSetPopulated[] = [];
  for (let i = 0; i < sets.length; i++) {
    const referenceSet = sets[i];
    const index = matchReferenceSetIntoListOfSets(referenceSet, mergedSets);
    if (index === -1) {
      mergedSets.push(referenceSet);
    }
    else {
      mergedSets[index] = unifyReferenceSets([mergedSets[index], referenceSet]);
    }
  }
  return mergedSets;
}

function ReferenceSetData_to_IReferenceSetPopulated(input: CreateReferenceSetInputData): IReferenceSetPopulated {
  const userId = input.userId;
  const { references, categories, machines, description, weight } = input.data;

  return {
    _id: new Types.ObjectId(),
    references: references.map(ref => ({
      reference: ref.reference,
      brand: new Types.ObjectId(ref.brand)
    })),
    categories: categories.map(c => new Types.ObjectId(c)),
    machines: machines.map(m => new Types.ObjectId(m)),
    description,
    weight,
    createdBy: userId,
    __v: 0
  } as unknown as IReferenceSetPopulated;
}

export async function simulateAddReferencesFromExcel(data: CreateReferencesFromExcelInputData) {
  const { data: sets, userId } = data;

  const mergedSets = matchAndMergeListOfReferenceSets(sets.map(set => ReferenceSetData_to_IReferenceSetPopulated({ data: set, userId })));


  const promises = sets.map(set => simulateAddReferenceManuallyService({data: set, userId}));

  return Promise.all(promises);

}