import React, { useState } from 'react';
import { FileText, Plus, Calendar, User, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useHealthRecords } from '@/hooks/useHealthRecords';
import { useAuth } from '@/hooks/useAuth';

const HealthRecordsTab = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRecord, setNewRecord] = useState({
    record_type: '',
    title: '',
    description: '',
    date: ''
  });
  
  const { healthRecords, createHealthRecord, loading } = useHealthRecords();
  const { user } = useAuth();

  const recordTypes = [
    { value: 'lab_result', label: 'Lab Result' },
    { value: 'prescription', label: 'Prescription' },
    { value: 'diagnosis', label: 'Diagnosis' },
    { value: 'vaccination', label: 'Vaccination' },
    { value: 'surgery', label: 'Surgery' },
    { value: 'consultation', label: 'Consultation Notes' },
    { value: 'imaging', label: 'Medical Imaging' },
    { value: 'other', label: 'Other' }
  ];

  const handleAddRecord = async () => {
    if (!newRecord.record_type || !newRecord.title || !newRecord.date) {
      return;
    }

    const recordData = {
      ...newRecord,
      client_id: user?.id || '',
      attachments: [],
      created_by: user?.id
    };

    const result = await createHealthRecord(recordData);
    if (result) {
      setNewRecord({
        record_type: '',
        title: '',
        description: '',
        date: ''
      });
      setShowAddForm(false);
    }
  };

  const getRecordTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      lab_result: 'bg-blue-100 text-blue-800',
      prescription: 'bg-green-100 text-green-800',
      diagnosis: 'bg-red-100 text-red-800',
      vaccination: 'bg-purple-100 text-purple-800',
      surgery: 'bg-orange-100 text-orange-800',
      consultation: 'bg-teal-100 text-teal-800',
      imaging: 'bg-pink-100 text-pink-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[type] || colors.other;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Health Records
        </h3>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Record
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Add Health Record</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Record Type</label>
                <Select 
                  value={newRecord.record_type} 
                  onValueChange={(value) => setNewRecord({ ...newRecord, record_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {recordTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Date</label>
                <Input
                  type="date"
                  value={newRecord.date}
                  onChange={(e) => setNewRecord({ ...newRecord, date: e.target.value })}
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input
                value={newRecord.title}
                onChange={(e) => setNewRecord({ ...newRecord, title: e.target.value })}
                placeholder="e.g., Blood Test Results, Prescription for..."
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={newRecord.description}
                onChange={(e) => setNewRecord({ ...newRecord, description: e.target.value })}
                placeholder="Additional details about this record..."
                rows={3}
              />
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleAddRecord}>Add Record</Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="text-center py-8">Loading health records...</div>
      ) : healthRecords.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No health records yet</h3>
            <p className="text-muted-foreground mb-4">
              Start building your digital health history by adding your first record.
            </p>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Record
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {healthRecords.map((record) => (
            <Card key={record.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${getRecordTypeColor(record.record_type)}`}>
                        {recordTypes.find(t => t.value === record.record_type)?.label || record.record_type}
                      </span>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(record.date).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <h4 className="font-medium mb-1">{record.title}</h4>
                    
                    {record.description && (
                      <p className="text-sm text-muted-foreground mb-2">
                        {record.description}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <User className="h-3 w-3" />
                      Added {new Date(record.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Upload className="h-4 w-4 mr-1" />
                      Attach File
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default HealthRecordsTab;