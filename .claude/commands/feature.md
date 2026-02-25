# Feature Implementation Command

Guide for implementing new features following project standards.

## Steps

1. **Requirements Analysis**
   - Understand the feature requirements
   - Identify affected components
   - Plan API endpoints needed
   - Design data models if needed

2. **Backend Implementation**

   ### Model (if needed)
   ```python
   # apps/<app>/models.py
   class NewModel(models.Model):
       id = models.UUIDField(primary_key=True, default=uuid.uuid4)
       # fields...
       created_at = models.DateTimeField(default=timezone.now)
       updated_at = models.DateTimeField(auto_now=True)
   ```

   ### Serializer
   ```python
   # apps/<app>/serializers.py
   class NewModelSerializer(serializers.ModelSerializer):
       class Meta:
           model = NewModel
           fields = ['id', ...]
   ```

   ### ViewSet
   ```python
   # apps/<app>/views.py
   class NewModelViewSet(viewsets.ModelViewSet):
       queryset = NewModel.objects.all()
       serializer_class = NewModelSerializer
       permission_classes = [IsAuthenticated]
   ```

   ### URL Registration
   ```python
   # apps/<app>/urls.py
   router.register(r'new-models', NewModelViewSet)
   ```

3. **Frontend Implementation**

   ### Types
   ```typescript
   // features/<feature>/types.ts
   interface NewModel {
     id: string;
     // fields...
   }
   ```

   ### API Hooks
   ```typescript
   // features/<feature>/hooks.ts
   const useNewModels = () => {
     const [data, setData] = useState<NewModel[]>([]);
     // fetch logic...
   };
   ```

   ### Components
   ```typescript
   // features/<feature>/NewModelList.tsx
   const NewModelList: React.FC = () => {
     // component logic...
   };
   ```

4. **Testing**
   - Write backend tests
   - Run TypeScript check
   - Manual testing

5. **Documentation**
   - Update API docs if needed
   - Add comments for complex logic

## Checklist
- [ ] Backend model created
- [ ] Migrations applied
- [ ] Serializer implemented
- [ ] ViewSet with permissions
- [ ] Frontend types defined
- [ ] Components created
- [ ] API integration tested
- [ ] Error handling added
