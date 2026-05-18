import divisionsRaw from 'bangladesh-geojson/divisions';
import districtsRaw from 'bangladesh-geojson/districts';
import upazilasRaw from 'bangladesh-geojson/upazilas';

const divisions = divisionsRaw.divisions;
const districts = districtsRaw.districts;
const upazilas = upazilasRaw.upazilas;

export function getDivisions() {
  return divisions;
}

export function getDivisionById(id) {
  if (id == null || id === '') return undefined;
  return divisions.find((d) => String(d.id) === String(id));
}

export function getDistrictsByDivision(divisionId) {
  return districts.filter((d) => String(d.division_id) === String(divisionId));
}

export function getDistrictById(id) {
  if (id == null || id === '') return undefined;
  return districts.find((d) => String(d.id) === String(id));
}

export function getUpazilasByDistrict(districtId) {
  return upazilas.filter((u) => String(u.district_id) === String(districtId));
}

export function getUpazilaById(id) {
  if (id == null || id === '') return undefined;
  return upazilas.find((u) => String(u.id) === String(id));
}

export function locationLabel(item) {
  return item?.bn_name || item?.name || '';
}

export function toSelectOptions(items) {
  return items.map((item) => ({
    value: item.id,
    label: locationLabel(item),
  }));
}

export function resolveLocationNames({ division, district, thana }) {
  return {
    division: locationLabel(getDivisionById(division)),
    district: locationLabel(getDistrictById(district)),
    thana: locationLabel(getUpazilaById(thana)),
  };
}
